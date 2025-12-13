import { rules, defaultRules, createComparison } from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const search = createComparison(defaultRules[skipEmptyTargetValues]);

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data.filter(row => search(row, rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)));
    }
}