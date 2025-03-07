import type { ThemeParams } from '@ag-grid-community/theming';
import { allParamModels } from '@components/theme-builder/model/ParamModel';
import { allGroupModels } from '@components/theme-builder/model/PartModel';
import { enabledAdvancedParamsAtom } from '@components/theme-builder/model/advanced-params';
import { getApplicationConfigAtom } from '@components/theme-builder/model/application-config';
import { resetChangedModelItems } from '@components/theme-builder/model/changed-model-items';
import { logErrorMessageOnce } from '@components/theme-builder/model/utils';

import type { Store } from '../../model/store';
import { gridConfigAtom } from '../grid-config/grid-config-atom';
import { type ProductionGridConfigField, defaultConfigFields } from '../grid-config/grid-options';

export type Preset = {
    pageBackgroundColor: string;
    params?: Partial<ThemeParams>;
    additionalGridFeatures?: ProductionGridConfigField[];
    // e.g. {iconSet: "alpine"} or {iconSet: "quartzBold"}
    parts?: Record<string, string>;
};

export const lightModePreset: Preset = {
    pageBackgroundColor: '#FAFAFA',
    params: {
        headerFontSize: 14,
        browserColorScheme: 'light',
        menuShadow: {
            color: 'red',
            offsetX: 10,
            offsetY: 10,
            radius: 20,
            spread: 5,
        },
    },
};

export const darkModePreset: Preset = {
    pageBackgroundColor: '#1D2634',
    params: {
        backgroundColor: '#1f2836',
        foregroundColor: '#FFF',
        browserColorScheme: 'dark',
        chromeBackgroundColor: {
            ref: 'foregroundColor',
            mix: 0.07,
            onto: 'backgroundColor',
        },
        headerFontSize: 14,
    },
};

export const allPresets: Preset[] = [
    lightModePreset,
    darkModePreset,
    {
        pageBackgroundColor: '#182323',
        params: {
            fontFamily: { googleFont: 'IBM Plex Mono' },
            fontSize: 12,
            backgroundColor: '#21222C',
            foregroundColor: '#68FF8E',
            browserColorScheme: 'dark',
            accentColor: '#00A2FF',
            borderColor: '#429356',
            gridSize: 4,
            wrapperBorderRadius: 0,
            borderRadius: 0,
            headerBackgroundColor: '#21222C',
            headerTextColor: '#68FF8E',
            headerFontSize: 14,
            headerFontWeight: 700,
            headerVerticalPaddingScale: 1.5,
            cellTextColor: '#50F178',
            oddRowBackgroundColor: '#21222C',
            rowVerticalPaddingScale: 1.5,
            cellHorizontalPaddingScale: 0.8,
            wrapperBorder: true,
            rowBorder: true,
            columnBorder: true,
            sidePanelBorder: true,

            rangeSelectionBorderColor: 'yellow',
            rangeSelectionBorderStyle: 'dashed',
            rangeSelectionBackgroundColor: 'color-mix(in srgb, transparent, yellow 10%)',
        },
        additionalGridFeatures: ['columnsToolPanel'],
    },
    {
        pageBackgroundColor: '#F6F8F9',
        params: {
            fontFamily: { googleFont: 'Inter' },
            fontSize: 13,
            backgroundColor: '#FFFFFF',
            foregroundColor: '#555B62',
            browserColorScheme: 'light',
            accentColor: '#087AD1',
            borderColor: '#D7E2E6',
            chromeBackgroundColor: {
                ref: 'backgroundColor',
            },
            gridSize: 6,
            wrapperBorderRadius: 2,
            borderRadius: 2,
            headerBackgroundColor: '#FFFFFF',
            headerTextColor: '#84868B',
            headerFontSize: 13,
            headerFontWeight: 400,
            rowVerticalPaddingScale: 0.8,
            cellHorizontalPaddingScale: 0.7,
            wrapperBorder: false,
            rowBorder: true,
            columnBorder: false,
            sidePanelBorder: true,
        },
    },
    {
        pageBackgroundColor: '#141516',
        params: {
            fontFamily: { googleFont: 'Roboto' },
            fontSize: 16,
            backgroundColor: '#0C0C0D',
            foregroundColor: '#BBBEC9',
            browserColorScheme: 'dark',
            accentColor: '#15BDE8',
            borderColor: '#ffffff00',
            chromeBackgroundColor: {
                ref: 'backgroundColor',
            },
            gridSize: 8,
            wrapperBorderRadius: 0,
            borderRadius: 20,
            headerBackgroundColor: '#182226',
            headerTextColor: '#FFFFFF',
            headerFontSize: 14,
            headerFontWeight: 500,
            headerVerticalPaddingScale: 0.9,
            rowVerticalPaddingScale: 1.2,
            cellHorizontalPaddingScale: 1,
            wrapperBorder: false,
            rowBorder: false,
            columnBorder: false,
            sidePanelBorder: false,
            iconSize: 20,
        },
    },
    {
        pageBackgroundColor: '#ffffff',
        params: {
            backgroundColor: '#ffffff',
            browserColorScheme: 'light',
            headerBackgroundColor: '#F9FAFB',
            headerTextColor: '#919191',
            foregroundColor: 'rgb(46, 55, 66)',
            fontFamily: { googleFont: 'Arial' },
            gridSize: 8,
            wrapperBorderRadius: 0,
            headerFontWeight: 600,
            oddRowBackgroundColor: '#F9FAFB',
            headerFontSize: 14,
            wrapperBorder: false,
            rowBorder: false,
            columnBorder: false,
            sidePanelBorder: false,
        },
        parts: {
            iconSet: 'quartzLight',
        },
    },

    {
        pageBackgroundColor: '#FFEAC1',
        params: {
            fontFamily: { googleFont: 'Merriweather' },
            fontSize: 13,
            backgroundColor: '#FFDEB4',
            foregroundColor: '#593F2B',
            browserColorScheme: 'light',
            accentColor: '#064DB9',
            borderColor: '#E9CBA4',
            chromeBackgroundColor: {
                ref: 'backgroundColor',
            },
            gridSize: 6,
            wrapperBorderRadius: 0,
            borderRadius: '0',
            headerBackgroundColor: '#FAD0A3',
            headerTextColor: '#4C3F35',
            headerFontFamily: { googleFont: 'UnifrakturCook' },
            headerFontSize: 16,
            headerFontWeight: 600,
            headerVerticalPaddingScale: 1.6,
            rowVerticalPaddingScale: 1,
            cellHorizontalPaddingScale: 1,
            wrapperBorder: false,
            rowBorder: true,
            columnBorder: false,
            sidePanelBorder: true,
        },
    },
    {
        pageBackgroundColor: 'rgb(75, 153, 154)',
        params: {
            fontFamily: { googleFont: 'Pixelify Sans' },
            fontSize: 15,
            backgroundColor: '#F1EDE1',
            foregroundColor: '#605E57',
            browserColorScheme: 'light',
            accentColor: '#0086F4',
            borderColor: '#98968F',
            chromeBackgroundColor: {
                ref: 'backgroundColor',
            },
            gridSize: 5,
            wrapperBorderRadius: 0,
            borderRadius: 0,
            headerBackgroundColor: '#E4DAD1',
            headerTextColor: '#3C3A35',
            headerFontSize: 15,
            headerFontWeight: 700,
            rowVerticalPaddingScale: 1.2,
        },
        parts: {
            iconSet: 'alpine',
        },
    },
];

export const applyPreset = (store: Store, preset: Preset) => {
    const presetParams: any = preset.params || {};
    const advancedParams = new Set<string>();
    for (const { property, valueAtom, onlyEditableAsAdvancedParam } of allParamModels()) {
        if (store.get(valueAtom) != null || presetParams[property] != null) {
            store.set(valueAtom, presetParams[property] ?? null);
        }
        if (presetParams[property] != null && onlyEditableAsAdvancedParam) {
            advancedParams.add(property);
        }
    }
    store.set(enabledAdvancedParamsAtom, advancedParams);

    const activeConfigFields = Array.from(new Set(defaultConfigFields.concat(preset.additionalGridFeatures || [])));
    store.set(gridConfigAtom, Object.fromEntries(activeConfigFields.map((field) => [field, true])));

    const presetParts = preset.parts || {};
    for (const group of allGroupModels()) {
        const newVariant = presetParts[group.groupId];
        if (store.get(group.selectedPartAtom) != null || newVariant != null) {
            const newPart = newVariant == null ? group.defaultPart : group.parts.find((v) => v.variant === newVariant);
            if (!newPart) {
                throw new Error(
                    `Invalid variant ${newVariant} for group ${group.groupId}, use one of: ${group.parts.map((v) => v.variant).join(', ')}`
                );
            }
            store.set(group.selectedPartAtom, newPart);
        }
    }
    const validPartIds = allGroupModels().map((pm) => pm.groupId);
    const invalidParts = Object.keys(presetParts).filter((partId) => partId && !validPartIds.includes(partId));
    if (invalidParts.length) {
        logErrorMessageOnce(`Preset contains invalid part: ${invalidParts.join(', ')}`);
    }
    store.set(getApplicationConfigAtom('previewPaneBackgroundColor'), preset.pageBackgroundColor || null);
    resetChangedModelItems(store);
};
