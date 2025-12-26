/**
 * Deposit Page Calculations Demo
 * 
 * This script demonstrates how USDC to Vault Token (syUSD, syBTC, syETH) conversions work
 * in the deposit page.
 */

// Simulated API responses (in real app, these come from APIs)
const mockData = {
  // Share prices from exchange_rates API
  sharePrices: {
    syUSD: 1.0407,  // 1 syUSD = 1.0407 USDC
    syBTC: 1.05,    // 1 syBTC = 1.05 BTC
    syETH: 1.08,    // 1 syETH = 1.08 ETH
  },
  
  // Currency rates from currency_rates API
  currencyRates: {
    BTC: 95000,     // 1 BTC = $95,000 USD
    ETH: 3200,      // 1 ETH = $3,200 USD
  }
};

/**
 * Calculate vault token amount from USDC
 * 
 * For USD vaults (syUSD, syHLP):
 *   vaultTokenAmount = USDC / sharePrice
 * 
 * For BTC vaults (syBTC):
 *   Step 1: Convert USDC to BTC = USDC / BTC_price
 *   Step 2: Convert BTC to syBTC = BTC / sharePrice
 *   Result: (USDC / BTC_price) / sharePrice
 * 
 * For ETH vaults (syETH):
 *   Step 1: Convert USDC to ETH = USDC / ETH_price
 *   Step 2: Convert ETH to syETH = ETH / sharePrice
 *   Result: (USDC / ETH_price) / sharePrice
 */
function convertUSDCToVaultToken(usdcAmount, vaultSymbol) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`CONVERSION: ${usdcAmount} USDC → ${vaultSymbol}`);
  console.log(`${'='.repeat(60)}`);
  
  const sharePrice = mockData.sharePrices[vaultSymbol];
  const lowerSymbol = vaultSymbol.toLowerCase();
  
  // For USD-based vaults (syUSD, syHLP)
  if (!lowerSymbol.includes('btc') && !lowerSymbol.includes('eth')) {
    const result = usdcAmount / sharePrice;
    console.log(`\n📊 USD Vault Calculation:`);
    console.log(`   Formula: vaultTokenAmount = USDC / sharePrice`);
    console.log(`   Calculation: ${usdcAmount} / ${sharePrice} = ${result.toFixed(6)}`);
    console.log(`\n✅ Result: ${result.toFixed(6)} ${vaultSymbol}`);
    return result;
  }
  
  // For BTC/ETH vaults
  let assetName, assetPrice;
  if (lowerSymbol.includes('btc')) {
    assetName = 'BTC';
    assetPrice = mockData.currencyRates.BTC;
  } else if (lowerSymbol.includes('eth')) {
    assetName = 'ETH';
    assetPrice = mockData.currencyRates.ETH;
  }
  
  console.log(`\n📊 ${assetName} Vault Calculation (2-step process):`);
  console.log(`\n   Step 1: Convert USDC → ${assetName}`);
  console.log(`   Formula: assetAmount = USDC / ${assetName}_price`);
  const assetAmount = usdcAmount / assetPrice;
  console.log(`   Calculation: ${usdcAmount} / ${assetPrice} = ${assetAmount.toFixed(8)} ${assetName}`);
  
  console.log(`\n   Step 2: Convert ${assetName} → ${vaultSymbol}`);
  console.log(`   Formula: vaultTokenAmount = ${assetName} / sharePrice`);
  const vaultTokenAmount = assetAmount / sharePrice;
  console.log(`   Calculation: ${assetAmount.toFixed(8)} / ${sharePrice} = ${vaultTokenAmount.toFixed(6)} ${vaultSymbol}`);
  
  console.log(`\n   Combined Formula: (USDC / ${assetName}_price) / sharePrice`);
  console.log(`   Combined Calculation: (${usdcAmount} / ${assetPrice}) / ${sharePrice} = ${vaultTokenAmount.toFixed(6)}`);
  
  console.log(`\n✅ Result: ${vaultTokenAmount.toFixed(6)} ${vaultSymbol}`);
  return vaultTokenAmount;
}

/**
 * Calculate conversion rate (1 USDC = ? vault tokens)
 */
function calculateConversionRate(vaultSymbol) {
  const rate = convertUSDCToVaultToken(1, vaultSymbol);
  console.log(`\n💱 Conversion Rate: 1 USDC = ${rate.toFixed(6)} ${vaultSymbol}`);
  return rate;
}

// Demo calculations
console.log('\n' + '='.repeat(60));
console.log('DEPOSIT PAGE CALCULATIONS DEMONSTRATION');
console.log('='.repeat(60));

// Example 1: syUSD (USD vault)
console.log('\n\n📌 EXAMPLE 1: syUSD (USD Vault)');
convertUSDCToVaultToken(1000, 'syUSD');
calculateConversionRate('syUSD');

// Example 2: syBTC (BTC vault)
console.log('\n\n📌 EXAMPLE 2: syBTC (BTC Vault)');
convertUSDCToVaultToken(1000, 'syBTC');
calculateConversionRate('syBTC');

// Example 3: syETH (ETH vault)
console.log('\n\n📌 EXAMPLE 3: syETH (ETH Vault)');
convertUSDCToVaultToken(1000, 'syETH');
calculateConversionRate('syETH');

// Example 4: Different amounts
console.log('\n\n📌 EXAMPLE 4: Different USDC Amounts for syUSD');
[100, 500, 1000, 5000, 10000].forEach(amount => {
  const result = convertUSDCToVaultToken(amount, 'syUSD');
  console.log(`   ${amount} USDC → ${result.toFixed(6)} syUSD`);
});

console.log('\n\n' + '='.repeat(60));
console.log('SUMMARY OF FORMULAS');
console.log('='.repeat(60));
console.log(`
For USD Vaults (syUSD, syHLP):
  vaultTokenAmount = USDC / sharePrice

For BTC Vaults (syBTC):
  vaultTokenAmount = (USDC / BTC_price) / sharePrice
  OR
  vaultTokenAmount = USDC / (BTC_price × sharePrice)

For ETH Vaults (syETH):
  vaultTokenAmount = (USDC / ETH_price) / sharePrice
  OR
  vaultTokenAmount = USDC / (ETH_price × sharePrice)

Conversion Rate (1 USDC = ? vault tokens):
  rate = vaultTokenAmount / USDC
  OR
  rate = 1 / sharePrice (for USD vaults)
  rate = 1 / (asset_price × sharePrice) (for BTC/ETH vaults)
`);

console.log('\n');

