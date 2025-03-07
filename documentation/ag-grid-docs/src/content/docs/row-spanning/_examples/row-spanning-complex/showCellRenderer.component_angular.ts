import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    template: `
        <div>
            <div :class="show-name">
                {{ showName }}
            </div>
            <div :class="show-presenter">
                {{ presenterName }}
            </div>
        </div>
    `,
})
export class ShowCellRenderer implements ICellRendererAngularComp {
    // Init Cell Value
    public showName!: string;
    public presenterName!: string;
    agInit(params: ICellRendererParams): void {
        this.refresh(params);
    }

    // Return Cell Value
    refresh(params: ICellRendererParams): boolean {
        if (!params.value) {
            return true;
        }
        this.showName = params.value.name;
        this.presenterName = params.value.presenter;
        return true;
    }
}
