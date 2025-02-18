export const formatNumber = (number: number | string): string => {
    // Convert number to string if it's not already
    let numStr = number.toString();
  
    // Check if number contains decimal point
    if (!numStr.includes(".")) {
      numStr += ".00";
    }
  
    // Regular expression to add commas
    return numStr.replace(/\d(?=(\d{3})+(\.|$))/g, "$&,");
  };