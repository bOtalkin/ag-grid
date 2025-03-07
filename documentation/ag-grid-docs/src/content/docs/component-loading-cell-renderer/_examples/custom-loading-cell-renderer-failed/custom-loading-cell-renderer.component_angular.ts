import { ILoadingCellRendererAngularComp } from '@ag-grid-community/angular';
import { ILoadingCellRendererParams } from '@ag-grid-community/core';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    template: `
        <div class="ag-custom-loading-cell" style="padding-left: 10px; line-height: 25px;">
            @if (params.node.failedLoad) {
                <i class="fas fa-times"></i>
                <span> Data failed to load </span>
            } @else {
                <i class="fas fa-spinner fa-pulse"></i>
                <span> {{ params.loadingMessage }} </span>
            }
        </div>
    `,
})
export class CustomLoadingCellRenderer implements ILoadingCellRendererAngularComp {
    public params!: ILoadingCellRendererParams & { loadingMessage: string };

    agInit(params: ILoadingCellRendererParams & { loadingMessage: string }): void {
        this.params = params;
    }
}
