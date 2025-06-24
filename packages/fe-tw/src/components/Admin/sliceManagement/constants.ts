import { StepsStatus } from "../buildingManagement/types";
import * as Yup from "yup";

export type CreateSliceFormProps = {
    name: string,
    description: string,
    endDate: string,
    sliceImageIpfsId: string,
    symbol: string,
    sliceImageIpfsFile?: File,
};

export type AddSliceAllocationFormProps = {
    tokenAssets: string[],
    tokenAssetAmounts: { [key: string]: string },
    depositAmount?: string,
    rewardAmount?: string,
};

export const addAllocationFormInitialValues = {
    tokenAssets: [undefined as any],
    tokenAssetAmounts: {},
    depositAmount: '0',
    rewardAmount: '100',
};

export const deploySliceFormInitialValues = {
    name: "",
    description: "",
    endDate: "",
    symbol: "",
    sliceImageIpfsId: "",
    sliceImageIpfsFile: undefined,
};

export const INITIAL_VALUES = {
    slice: deploySliceFormInitialValues,
    sliceAllocation: addAllocationFormInitialValues,
};

const validateAssetsField = (val: any) => val.when('tokenAssetAmounts', ([assetsAmounts]:
    [{
        [key: string]: number,
    }],
    schema: Yup.Schema
) => {
    return schema.test(
        'token_assets_min', 'Minimum count of assets is is 2',
        (value: string[]) => {
            return value?.some((asset) => !!asset) ? value?.filter((asset) => !!asset).length >= 2 : true;
        }
    ).test(
        'token_assets_max', 'Maximum count of assets is 5',
        (value: string[]) => value?.length < 5,
    ).test(
        'token_assets_allocation_amount', 'Every token asset should have allocation assigned',
        (value: string[]) => {
            return value?.some((asset) => !!asset) ? value.every((val) => val ? !!assetsAmounts[val] : true) : true;
        }
    ).test(
        'token_assets_allocation_amount_100%', 'Total token assets allocation should be equal to 100%',
        (value: string[]) => value?.some((asset) => !!asset) ? value.reduce((acc, val) => {
            return acc += (val ? Number(assetsAmounts[val]) : 0);
        }, 0) === 100 : true,
    )
});

export const validationSchema = Yup.object({
    slice: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        endDate: Yup.string().when('tokenAssets', ([_tokenAssets]: string[][], schema: Yup.Schema) => {
                return schema.test('incoming_date', 'Should be incoming date', (value?: string) => {
                    if (!value) {
                        return true;
                    }

                    const endDate = new Date(value);

                    return endDate > new Date();
                })
        }),
        symbol: Yup.string().required('Symbol is required'),
        sliceImageIpfsFile: Yup.string().test(function (value) {
                const { sliceImageIpfsId } = this.parent;

                if (value) {
                    return true;
                }

                return sliceImageIpfsId !== undefined;
            }),
        sliceImageIpfsId: Yup.string().test(function (value) {
            const { sliceImageIpfsFile } = this.parent;
            
            if (value) {
                return true;
            }

            return sliceImageIpfsFile !== undefined;
        }),
    }),
    sliceAllocation: Yup.object().shape({
        tokenAssets: validateAssetsField(Yup.array().of(Yup.string())),
        depositAmount: Yup.string(),
        rewardAmount: Yup.string(),
        tokenAssetAmounts: Yup.object(),
    }),
});

export const STEPS = ["slice", "sliceAllocation"];

export const FRIENDLY_STEP_NAME = {
   slice: "Deploy Slice",
   sliceAllocation: "Add Slice Allocations",
};

export const FRIENDLY_STEP_STATUS: Record<StepsStatus, string> = {
   [StepsStatus.NOT_STARTED]: "Not Started",
   [StepsStatus.IN_PROGRESS]: "In Progress",
   [StepsStatus.VALID]: "Valid",
   [StepsStatus.INVALID]: "Invalid",
   [StepsStatus.DEPLOYED]: "Deployed",
};
