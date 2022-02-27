
import { LCDClient } from '@terra-money/terra.js';
import { cLunaContract, cLunaQuery } from './components/prism.js';
import { bLunaContract, bLunaQuery, stLunaContract, stLunaQuery, nLunaContract, nLunaQuery } from './components/astroport.js';

const DECIMAL = 1e6;

const terra = new LCDClient({
    URL: 'https://lcd.terra.dev',
    chainID: 'columbus-5'
 });

const getPrice = async (contractAddr, query) => {
    const result = await terra.wasm.contractQuery(
        contractAddr,
        query
      );
    return result;
}

const getArb = (price) => (price*100-100).toFixed(2);

const getLunaPrice = async () => {
    const exchangeRates = await terra.oracle.exchangeRates();
    const lunaPrice = exchangeRates.get('uusd');
    return lunaPrice;
}

const main = async () => {
    const lunaPrice = await getLunaPrice();
    // bLuna
    const bLunaPrice = await getPrice(bLunaContract, bLunaQuery);
    const bLunaRounded = bLunaPrice.return_amount/DECIMAL;

    // cLuna
    const cLunaPrice = await getPrice(cLunaContract, cLunaQuery);
    const cLunaRounded = cLunaPrice.amount/DECIMAL;

    // stLuna
    const stLunaPrice = await getPrice(stLunaContract, stLunaQuery);
    const stLunaRounded = stLunaPrice.return_amount/DECIMAL;

    // nLuna
    const nLunaPrice = await getPrice(nLunaContract, nLunaQuery);
    const nLunaRounded = nLunaPrice.amount/DECIMAL;

    console.log(`1 luna = ${(lunaPrice.amount).toFixed(5)} UST`);
    console.log(`1 luna = ${bLunaRounded} bLuna (arb: ${getArb(bLunaRounded)}%)`);
    console.log(`1 luna = ${cLunaRounded} cLuna (arb: ${getArb(cLunaRounded)}%)`);
    console.log(`1 luna = ${stLunaRounded} stLuna (arb: ${getArb(stLunaRounded)}%)`);
    console.log(`1 luna = ${nLunaRounded} nLuna (arb: ${getArb(nLunaRounded)}%)`);
} 

main();