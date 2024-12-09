export function useRebalanceSlice(sliceName: string) {
    async function rebalance() {
      // TODO: actually rebalance
      console.log(`Rebalance requested for slice: ${sliceName}`);
    }
  
    return { rebalance };
  }