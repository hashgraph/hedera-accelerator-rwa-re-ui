import * as Yup from "yup";

export const validateAmountField = (val: any, fieldName: string) => val.when('tokenAssets', ([tokenAssets]: string[][], schema: Yup.Schema) => {
   return schema.test(
      `total_${fieldName}_amount`, `Minimum ${fieldName} amount is 100`,
      (value: string) => tokenAssets?.length > 0 ? !!Number(value) && Number(value) >= 100 : true
   )
});

export const validateAssetsField = (val: any) => val.when('tokenAssetAmounts', ([assetsAmounts]: [{
   [key: string]: number,
}], schema: Yup.Schema) => {
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
      (value: string[]) => {
         return value?.some((asset) => !!asset) ?
            value.reduce((acc, val) => {
               return acc += (val ? Number(assetsAmounts[val]) : 0);
            }, 0) === 100 : true;
      }
    )
});

export const INITIAL_VALUES = {
   sliceDeposit: {
      depositAmount: '0',
      tokenAssets: [undefined as any],
   },
   sliceAllocation: {
      tokenAssets: [undefined as any],
      tokenAssetAmounts: {},
      rewardAmount: '100',
   },
};

export const sliceDepositSchema = Yup.object().shape({
   tokenAssets: validateAssetsField(Yup.array().of(Yup.string())),
   depositAmount: validateAmountField(Yup.string(), 'deposit'),
});

export const sliceRebalanceSchema = Yup.object().shape({
   tokenAssets: validateAssetsField(Yup.array().of(Yup.string())),
   rewardAmount: Yup.string(),
   tokenAssetAmounts: Yup.object(),
});
   