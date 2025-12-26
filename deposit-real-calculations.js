/**
 * Deposit Page Real Calculations
 * 
 * Fetches REAL data from APIs and shows actual calculations
 * that are currently displayed in the UI
 */

// Simple fetch wrapper for Node.js
async function fetchApi(url) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch vault configuration
 */
async function fetchVaultConfig(vaultSymbol) {
  const endpoint = `https://api.lucidly.finance/services/vault_config?vaultSymbol=${encodeURIComponent(vaultSymbol)}`;
  const response = await fetchApi(endpoint);
  return response.result;
}

/**
 * Fetch vault share price
 */
async function fetchVaultSharePrice(vaultAddress) {
  const endpoint = `https://api.lucidly.finance/services/exchange_rates?vaultAddress=${encodeURIComponent(vaultAddress)}`;
  const response = await fetchApi(endpoint);
  
  // Handle different response formats
  if (typeof response === 'number') {
    return response;
  } else if (response && typeof response === 'object' && 'result' in response) {
    return response.result;
  }
  
  return parseFloat(String(response));
}

/**
 * Fetch currency rate (BTC/ETH price)
 */
async function fetchCurrencyRate(assetName) {
  const endpoint = `https://api.lucidly.finance/services/currency_rates?assetName=${encodeURIComponent(assetName)}`;
  const response = await fetchApi(endpoint);
  
  return {
    rate: parseFloat(response.result),
    updatedAt: response.updated_at,
  };
}

/**
 * Convert USDC to vault token (REAL implementation)
 */
async function convertUSDCToVaultToken(usdcAmount, vaultSymbol) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🔄 REAL CONVERSION: ${usdcAmount} USDC → ${vaultSymbol}`);
  console.log(`${'='.repeat(70)}`);
  
  // Get vault config
  console.log(`\n📋 Step 1: Fetching vault configuration...`);
  const config = await fetchVaultConfig(vaultSymbol);
  
  if (!config) {
    throw new Error(`Vault config not found for ${vaultSymbol}`);
  }
  
  const vaultAddress = config.vault_constants.address;
  console.log(`   ✅ Vault Address: ${vaultAddress}`);
  console.log(`   ✅ Vault Name: ${config.vault_constants.name}`);
  
  const lowerSymbol = vaultSymbol.toLowerCase();
  
  // Fetch share price
  console.log(`\n📊 Step 2: Fetching share price from exchange_rates API...`);
  const sharePrice = await fetchVaultSharePrice(vaultAddress);
  console.log(`   ✅ Share Price: ${sharePrice}`);
  console.log(`   📝 Meaning: 1 ${vaultSymbol} = ${sharePrice} ${lowerSymbol.includes('btc') ? 'BTC' : lowerSymbol.includes('eth') ? 'ETH' : 'USDC'}`);
  
  // For USD-based vaults
  if (!lowerSymbol.includes('btc') && !lowerSymbol.includes('eth')) {
    console.log(`\n💰 Step 3: Calculating USD vault conversion...`);
    const result = usdcAmount / sharePrice;
    
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`📐 CALCULATION FORMULA:`);
    console.log(`   vaultTokenAmount = USDC / sharePrice`);
    console.log(`   vaultTokenAmount = ${usdcAmount} / ${sharePrice}`);
    console.log(`   vaultTokenAmount = ${result.toFixed(6)}`);
    console.log(`${'─'.repeat(70)}`);
    
    console.log(`\n✅ FINAL RESULT: ${result.toFixed(6)} ${vaultSymbol}`);
    console.log(`\n💱 Conversion Rate: 1 USDC = ${(1 / sharePrice).toFixed(6)} ${vaultSymbol}`);
    
    return result;
  }
  
  // For BTC/ETH vaults
  let assetName, assetPrice;
  if (lowerSymbol.includes('btc')) {
    assetName = 'BTC';
    console.log(`\n📊 Step 3: Fetching BTC price from currency_rates API...`);
    const btcPriceData = await fetchCurrencyRate('BTC');
    assetPrice = btcPriceData.rate;
    console.log(`   ✅ BTC Price: $${assetPrice.toLocaleString()}`);
    console.log(`   📅 Updated At: ${new Date(btcPriceData.updatedAt * 1000).toLocaleString()}`);
  } else if (lowerSymbol.includes('eth')) {
    assetName = 'ETH';
    console.log(`\n📊 Step 3: Fetching ETH price from currency_rates API...`);
    const ethPriceData = await fetchCurrencyRate('ETH');
    assetPrice = ethPriceData.rate;
    console.log(`   ✅ ETH Price: $${assetPrice.toLocaleString()}`);
    console.log(`   📅 Updated At: ${new Date(ethPriceData.updatedAt * 1000).toLocaleString()}`);
  }
  
  console.log(`\n💰 Step 4: Calculating ${assetName} vault conversion (2-step process)...`);
  
  // Step 1: USDC to underlying asset
  const assetAmount = usdcAmount / assetPrice;
  console.log(`\n   Step 4a: Convert USDC → ${assetName}`);
  console.log(`   Formula: assetAmount = USDC / ${assetName}_price`);
  console.log(`   Calculation: ${usdcAmount} / ${assetPrice} = ${assetAmount.toFixed(8)} ${assetName}`);
  
  // Step 2: Asset to vault token
  const vaultTokenAmount = assetAmount / sharePrice;
  console.log(`\n   Step 4b: Convert ${assetName} → ${vaultSymbol}`);
  console.log(`   Formula: vaultTokenAmount = ${assetName} / sharePrice`);
  console.log(`   Calculation: ${assetAmount.toFixed(8)} / ${sharePrice} = ${vaultTokenAmount.toFixed(6)} ${vaultSymbol}`);
  
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`📐 COMBINED CALCULATION FORMULA:`);
  console.log(`   vaultTokenAmount = (USDC / ${assetName}_price) / sharePrice`);
  console.log(`   vaultTokenAmount = (${usdcAmount} / ${assetPrice}) / ${sharePrice}`);
  console.log(`   vaultTokenAmount = ${vaultTokenAmount.toFixed(6)}`);
  console.log(`${'─'.repeat(70)}`);
  
  console.log(`\n✅ FINAL RESULT: ${vaultTokenAmount.toFixed(6)} ${vaultSymbol}`);
  
  const conversionRate = 1 / (assetPrice * sharePrice);
  console.log(`\n💱 Conversion Rate: 1 USDC = ${conversionRate.toFixed(6)} ${vaultSymbol}`);
  
  return vaultTokenAmount;
}

/**
 * Main function to demonstrate real calculations
 */
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 DEPOSIT PAGE - REAL CALCULATIONS WITH LIVE API DATA');
  console.log('='.repeat(70));
  console.log('\nThis script fetches REAL data from the APIs and shows');
  console.log('the exact calculations that are displayed in the UI.\n');
  
  const vaults = ['syUSD', 'syBTC', 'syETH', 'syHLP'];
  const testAmounts = [1, 100, 1000];
  
  for (const vaultSymbol of vaults) {
    try {
      console.log(`\n\n${'█'.repeat(70)}`);
      console.log(`   VAULT: ${vaultSymbol}`);
      console.log(`${'█'.repeat(70)}`);
      
      // Test with 1 USDC (base rate shown in UI)
      await convertUSDCToVaultToken(1, vaultSymbol);
      
      // Test with other amounts
      for (const amount of testAmounts.filter(a => a !== 1)) {
        await convertUSDCToVaultToken(amount, vaultSymbol);
      }
      
    } catch (error) {
      console.error(`\n❌ Error processing ${vaultSymbol}:`, error.message);
    }
  }
  
  console.log(`\n\n${'='.repeat(70)}`);
  console.log('✅ ALL CALCULATIONS COMPLETE');
  console.log('='.repeat(70));
  console.log('\nThese are the REAL values currently showing in the UI!');
  console.log('The calculations use live data from:');
  console.log('  - exchange_rates API (share prices)');
  console.log('  - currency_rates API (BTC/ETH prices)');
  console.log('  - vault_config API (vault addresses)\n');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

