export const available = (data) => {
    return String(data) !== 'undefined' && String(data) !== 'null' && JSON.stringify(data) !== '{}'
};