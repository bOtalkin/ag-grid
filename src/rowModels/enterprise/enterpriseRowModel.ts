import {
    _,
    Autowired,
    Bean,
    BeanStub,
    Column,
    ColumnController,
    ColumnVO,
    Constants,
    Context,
    Events,
    EventService,
    FilterManager,
    GridOptionsWrapper,
    IEnterpriseDatasource,
    IEnterpriseRowModel,
    Logger,
    LoggerFactory,
    ModelUpdatedEvent,
    NumberSequence,
    PostConstruct,
    Qualifier,
    RowNode,
    RowNodeBlockLoader,
    RowNodeCache,
    SortController,
    RowBounds,
    GridApi,
    ColumnApi,
    RowDataChangedEvent,
    PreDestroy
} from "ag-grid";
import {EnterpriseCache, EnterpriseCacheParams} from "./enterpriseCache";

@Bean('rowModel')
export class EnterpriseRowModel extends BeanStub implements IEnterpriseRowModel {

    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('eventService') private eventService: EventService;
    @Autowired('context') private context: Context;
    @Autowired('columnController') private columnController: ColumnController;
    @Autowired('filterManager') private filterManager: FilterManager;
    @Autowired('sortController') private sortController: SortController;
    @Autowired('gridApi') private gridApi: GridApi;
    @Autowired('columnApi') private columnApi: ColumnApi;

    private rootNode: RowNode;
    private datasource: IEnterpriseDatasource;

    private rowHeight: number;

    private cacheParams: EnterpriseCacheParams;

    private logger: Logger;

    private rowNodeBlockLoader: RowNodeBlockLoader;

    @PostConstruct
    private postConstruct(): void {
        this.rowHeight = this.gridOptionsWrapper.getRowHeightAsNumber();
        this.addEventListeners();

        let datasource = this.gridOptionsWrapper.getEnterpriseDatasource();
        if (_.exists(datasource)) {
            this.setDatasource(datasource);
        }
    }

    @PreDestroy
    public destroy(): void {
        super.destroy();
    }

    @PreDestroy
    private destroyDatasource(): void {
        if (this.datasource && this.datasource.destroy) {
            this.datasource.destroy();
        }
        this.datasource = null;
    }

    private setBeans(@Qualifier('loggerFactory') loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create('EnterpriseRowModel');
    }

    public isLastRowFound(): boolean {
        if (_.exists(this.rootNode) && _.exists(this.rootNode.childrenCache)) {
            return this.rootNode.childrenCache.isMaxRowFound();
        } else {
            return false;
        }
    }

    private addEventListeners(): void {
        this.addDestroyableEventListener(this.eventService, Events.EVENT_COLUMN_ROW_GROUP_CHANGED, this.onColumnRowGroupChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_ROW_GROUP_OPENED, this.onRowGroupOpened.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_COLUMN_PIVOT_MODE_CHANGED, this.onPivotModeChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.onColumnEverything.bind(this));

        this.addDestroyableEventListener(this.eventService, Events.EVENT_COLUMN_VALUE_CHANGED, this.onValueChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_COLUMN_PIVOT_CHANGED, this.onColumnPivotChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_FILTER_CHANGED, this.onFilterChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, Events.EVENT_SORT_CHANGED, this.onSortChanged.bind(this));
    }

    private onColumnEverything(): void {
        // this is a hack for one customer only, so they can suppress the resetting of the columns.
        // The problem the customer had was they were api.setColumnDefs() after the data source came
        // back with data. So this stops the reload from the grid after the data comes back.
        // Once we have "AG-1591 Allow delta changes to columns" fixed, then this hack can be taken out.
        if (this.gridOptionsWrapper.isSuppressEnterpriseResetOnNewColumns()) { return; }

        // every other customer can continue as normal and have it working!!!
        this.reset();
    }

    private onFilterChanged(): void {
        this.reset();
    }

    private onSortChanged(): void {
        this.reset();
    }

    private onValueChanged(): void {
        this.reset();
    }

    private onColumnRowGroupChanged(): void {
        this.reset();
    }

    private onColumnPivotChanged(): void {
        this.reset();
    }

    private onPivotModeChanged(): void {
        this.reset();
    }

    private onRowGroupOpened(event: any): void {
        let rowNode = <RowNode> event.node;
        if (rowNode.expanded) {
            if (_.missing(rowNode.childrenCache)) {
                this.createNodeCache(rowNode);
            }
        } else {
            if (this.gridOptionsWrapper.isPurgeClosedRowNodes() && _.exists(rowNode.childrenCache)) {
                rowNode.childrenCache.destroy();
                rowNode.childrenCache = null;
            }
        }
        this.updateRowIndexesAndBounds();

        let modelUpdatedEvent: ModelUpdatedEvent = {
            type: Events.EVENT_MODEL_UPDATED,
            api: this.gridOptionsWrapper.getApi(),
            columnApi: this.gridOptionsWrapper.getColumnApi(),
            newPage: false,
            newData: false,
            animate: true,
            keepRenderedRows: true
        };

        this.eventService.dispatchEvent(modelUpdatedEvent);
    }

    private reset(): void {

        this.rootNode = new RowNode();
        this.rootNode.group = true;
        this.rootNode.level = -1;
        this.context.wireBean(this.rootNode);

        if (this.datasource) {
            this.createNewRowNodeBlockLoader();
            this.cacheParams = this.createCacheParams();
            this.createNodeCache(this.rootNode);

            this.updateRowIndexesAndBounds();
        }

        // this event: 1) clears selection 2) updates filters 3) shows/hides 'no rows' overlay
        let rowDataChangedEvent: RowDataChangedEvent = {
            type: Events.EVENT_ROW_DATA_CHANGED,
            api: this.gridApi,
            columnApi: this.columnApi
        };
        this.eventService.dispatchEvent(rowDataChangedEvent);

        // this gets the row to render rows (or remove the previously rendered rows, as it's blank to start).
        // important to NOT pass in an event with keepRenderedRows or animate, as we want the renderer
        // to treat the rows as new rows, as it's all new data
        let modelUpdatedEvent: ModelUpdatedEvent = {
            type: Events.EVENT_MODEL_UPDATED,
            api: this.gridApi,
            columnApi: this.columnApi,
            animate: false,
            keepRenderedRows: false,
            newData: false,
            newPage: false
        };
        this.eventService.dispatchEvent(modelUpdatedEvent);
    }

    private createNewRowNodeBlockLoader(): void {
        this.destroyRowNodeBlockLoader();
        let maxConcurrentRequests = this.gridOptionsWrapper.getMaxConcurrentDatasourceRequests();
        this.rowNodeBlockLoader = new RowNodeBlockLoader(maxConcurrentRequests);
        this.context.wireBean(this.rowNodeBlockLoader);
    }

    private destroyRowNodeBlockLoader(): void {
        if (this.rowNodeBlockLoader) {
            this.rowNodeBlockLoader.destroy();
            this.rowNodeBlockLoader = null;
        }
    }

    public setDatasource(datasource: IEnterpriseDatasource): void {
        this.destroyDatasource();
        this.datasource = datasource;
        this.reset();
    }

    private toValueObjects(columns: Column[]): ColumnVO[] {
        return columns.map( col => <ColumnVO> {
            id: col.getId(),
            aggFunc: col.getAggFunc(),
            displayName: this.columnController.getDisplayNameForColumn(col, 'model'),
            field: col.getColDef().field
        });
    }

    private createCacheParams(): EnterpriseCacheParams {

        let rowGroupColumnVos = this.toValueObjects(this.columnController.getRowGroupColumns());
        let valueColumnVos = this.toValueObjects(this.columnController.getValueColumns());
        let pivotColumnVos = this.toValueObjects(this.columnController.getPivotColumns());

        let dynamicRowHeight = this.gridOptionsWrapper.isDynamicRowHeight();
        let maxBlocksInCache = this.gridOptionsWrapper.getMaxBlocksInCache();

        if (dynamicRowHeight && maxBlocksInCache >= 0 ) {
            console.warn('ag-Grid: Enterprise Row Model does not support Dynamic Row Height and Cache Purging. ' +
                'Either a) remove getRowHeight() callback or b) remove maxBlocksInCache property. Purging has been disabled.');
            maxBlocksInCache = undefined;
        }

        if (maxBlocksInCache >= 0 && this.columnController.isAutoRowHeightActive()) {
            console.warn('ag-Grid: Enterprise Row Model does not support Auto Row Height and Cache Purging. ' +
                'Either a) remove colDef.autoHeight or b) remove maxBlocksInCache property. Purging has been disabled.');
            maxBlocksInCache = undefined;
        }

        let params: EnterpriseCacheParams = {
            // the columns the user has grouped and aggregated by
            valueCols: valueColumnVos,
            rowGroupCols: rowGroupColumnVos,
            pivotCols: pivotColumnVos,
            pivotMode: this.columnController.isPivotMode(),

            // sort and filter model
            filterModel: this.filterManager.getFilterModel(),
            sortModel: this.extractSortModel(),

            rowNodeBlockLoader: this.rowNodeBlockLoader,

            datasource: this.datasource,
            lastAccessedSequence: new NumberSequence(),
            overflowSize: 1,
            initialRowCount: 1,
            maxConcurrentRequests: this.gridOptionsWrapper.getMaxConcurrentDatasourceRequests(),
            maxBlocksInCache: maxBlocksInCache,
            blockSize: this.gridOptionsWrapper.getCacheBlockSize(),
            rowHeight: this.rowHeight,
            dynamicRowHeight: dynamicRowHeight
        };

        // set defaults
        if ( !(params.maxConcurrentRequests>=1) ) {
            params.maxConcurrentRequests = 2;
        }
        // page size needs to be 1 or greater. having it at 1 would be silly, as you would be hitting the
        // server for one page at a time. so the default if not specified is 100.
        if ( !(params.blockSize>=1) ) {
            params.blockSize = 100;
        }
        // if user doesn't give initial rows to display, we assume zero
        if ( !(params.initialRowCount>=1) ) {
            params.initialRowCount = 0;
        }
        // if user doesn't provide overflow, we use default overflow of 1, so user can scroll past
        // the current page and request first row of next page
        if ( !(params.overflowSize>=1) ) {
            params.overflowSize = 1;
        }

        return params;
    }

    private createNodeCache(rowNode: RowNode): void {
        let cache = new EnterpriseCache(this.cacheParams, rowNode);
        this.context.wireBean(cache);

        cache.addEventListener(RowNodeCache.EVENT_CACHE_UPDATED, this.onCacheUpdated.bind(this));

        rowNode.childrenCache = cache;
    }

    private onCacheUpdated(): void {
        this.updateRowIndexesAndBounds();
        let modelUpdatedEvent: ModelUpdatedEvent = {
            type: Events.EVENT_MODEL_UPDATED,
            api: this.gridApi,
            columnApi: this.columnApi,
            animate: true,
            keepRenderedRows: true,
            newPage: false,
            newData: false
        };
        this.eventService.dispatchEvent(modelUpdatedEvent);
    }

    public updateRowIndexesAndBounds(): void {
        let cacheExists = _.exists(this.rootNode) && _.exists(this.rootNode.childrenCache);
        if (cacheExists) {
            // NOTE: should not be casting here, the RowModel should use IEnterpriseRowModel interface?
            let enterpriseCache = <EnterpriseCache> this.rootNode.childrenCache;
            this.resetRowTops(enterpriseCache);
            this.setDisplayIndexes(enterpriseCache);
        }
    }

    private setDisplayIndexes(cache: EnterpriseCache): void {
        let numberSequence = new NumberSequence();
        let nextRowTop = {value: 0};
        cache.setDisplayIndexes(numberSequence, nextRowTop);
    }

    // resetting row tops is needed for animation, as part of the operation is saving the old location,
    // which is needed for rows that are transitioning in
    private resetRowTops(cache: EnterpriseCache): void {
        let numberSequence = new NumberSequence();
        cache.forEachNodeDeep( rowNode => rowNode.clearRowTop(), numberSequence);
    }

    public getRow(index: number): RowNode {
        let cacheExists = _.exists(this.rootNode) && _.exists(this.rootNode.childrenCache);
        if (cacheExists) {
            return this.rootNode.childrenCache.getRow(index);
        } else {
            return null;
        }
    }

    public getPageFirstRow(): number {
        return 0;
    }

    public getPageLastRow(): number {
        let cacheExists = _.exists(this.rootNode) && _.exists(this.rootNode.childrenCache);
        let lastRow: number;
        if (cacheExists) {
            // NOTE: should not be casting here, the RowModel should use IEnterpriseRowModel interface?
            let enterpriseCache = <EnterpriseCache> this.rootNode.childrenCache;
            lastRow = enterpriseCache.getDisplayIndexEnd() - 1;
        } else {
            lastRow = 0;
        }

        return lastRow;
    }

    public getRowCount(): number {
        return this.getPageLastRow() + 1;
    }

    public getRowBounds(index: number): RowBounds {

        let cacheMissing = _.missing(this.rootNode) || _.missing(this.rootNode.childrenCache);

        if (cacheMissing) {
            return {
                rowTop: 0,
                rowHeight: this.rowHeight
            };
        }

        let enterpriseCache = <EnterpriseCache> this.rootNode.childrenCache;
        return enterpriseCache.getRowBounds(index);
    }

    public getRowIndexAtPixel(pixel: number): number {

        if (pixel === 0) return 0;

        let cacheMissing = _.missing(this.rootNode) || _.missing(this.rootNode.childrenCache);

        if (cacheMissing) return 0;

        let enterpriseCache = <EnterpriseCache> this.rootNode.childrenCache;
        let result = enterpriseCache.getRowIndexAtPixel(pixel);

        return result;
    }

    public getCurrentPageHeight(): number {
        let pageHeight = this.rowHeight * this.getRowCount();
        return pageHeight;
    }

    public isEmpty(): boolean {
        return false;
    }

    public isRowsToRender(): boolean {
        return this.getRowCount() > 0;
    }

    public getType(): string {
        return Constants.ROW_MODEL_TYPE_ENTERPRISE;
    }

    public forEachNode(callback: (rowNode: RowNode)=>void): void {
        if (this.rootNode && this.rootNode.childrenCache) {
            this.rootNode.childrenCache.forEachNodeDeep(callback, new NumberSequence());
        }
    }

    private executeOnCache(route: string[], callback: (cache: EnterpriseCache)=>void) {
        if (this.rootNode && this.rootNode.childrenCache) {
            let topLevelCache = <EnterpriseCache> this.rootNode.childrenCache;
            let cacheToPurge = topLevelCache.getChildCache(route);
            if (cacheToPurge) {
                callback(cacheToPurge);
            }
        }
    }

    public purgeCache(route: string[] = []): void {
        this.executeOnCache(route, cache => cache.purgeCache() );
    }

    public removeFromCache(route: string[], items: any[]): void {
        this.executeOnCache(route, cache => cache.removeFromCache(items) );
        this.rowNodeBlockLoader.checkBlockToLoad();
    }

    public addToCache(route: string[], items: any[], index: number): void {
        this.executeOnCache(route, cache => cache.addToCache(items, index) );
    }

    public getNodesInRangeForSelection(firstInRange: RowNode, lastInRange: RowNode): RowNode[] {
        if (_.exists(firstInRange) && firstInRange.parent !== lastInRange.parent) return [];
        return lastInRange.parent.childrenCache.getRowNodesInRange(firstInRange, lastInRange);
    }

    public getRowNode(id: string): RowNode {
        let result: RowNode = null;
        this.forEachNode(rowNode => {
            if(rowNode.id === id) {
                result = rowNode;
            }
        });
        return result;
    }

    public getBlockState(): any {
        if (this.rowNodeBlockLoader) {
            return this.rowNodeBlockLoader.getBlockState();
        } else {
            return null;
        }
    }

    public isRowPresent(rowNode: RowNode): boolean {
        return false;
    }

    private extractSortModel(): { colId: string; sort: string }[] {
        let sortModel = this.sortController.getSortModel();
        let rowGroupCols = this.toValueObjects(this.columnController.getRowGroupColumns());

        // find index of auto group column in sort model
        let index = -1;
        for (let i = 0; i < sortModel.length; ++i) {
            if (sortModel[i].colId === 'ag-Grid-AutoColumn') {
                index = i;
                break;
            }
        }

        // replace auto column with individual group columns
        if (index > -1) {
            let individualGroupCols =
                rowGroupCols.map(group => {
                    return {
                        colId: group.field,
                        sort: sortModel[index].sort
                    }
                });

            // remove auto group column
            sortModel.splice(index, 1);

            // insert individual group columns
            for (let i = 0; i < individualGroupCols.length; i++) {
                sortModel.splice(index++, 0, individualGroupCols[i]);
            }
        }

        return sortModel;
    };
}