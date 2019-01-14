
let doc = {
     isVariantsWithSamePrice: true,
    picturesUrl:
     [ 'https://firebasestorage.googleapis.com/v0/b/clothxnet.appspot.com/o/stores%2F1UbBP46mFdUI63eONqvT%2Fproducts%2F1543648350552_download.jpg?alt=media&token=d0fa9e4a-71bd-415c-87f1-05a49f3438e3' ],
    categories:
     { colorCategory: 'SandyBrown',
       category1: 'Kurtas',
       category2: 'pyjama' },
    hsnCode: '61',
    inclusiveAllTaxes: true,
    picturesPath:
     [ 'stores/1UbBP46mFdUI63eONqvT/products/1543648350552_download.jpg' ],
    productUid: 'zkAhK9SkIH3Jwa9FQmTU',
    description: 'Modi collection',
    gender: 'Men',
    hasNoGstNumber: true,
    otherTax: 0,
    productName: 'kurtha pyjama with jacket',
    storeId: '1UbBP46mFdUI63eONqvT',
    prn: 'rdzts',
    createdOn: 2018-12-01T07:13:01.209Z,
    storeDetails:
     { location: GeoPoint { _latitude: 10.996953099999999, _longitude: 76.95853369999999 },
       name: 'Magenta fashion*',
       address:
        { city: 'COIMBATORE',
          state: 'TAMIL NADU',
          pinCode: 641001,
          street: '48 vellipalam perur' },
       id: '1UbBP46mFdUI63eONqvT' },
    tags: [ '' ],
    variants:
     [ { size: 'm', stock: 12, purchasedPrice: 2500, sellingPrice: 3500 },
       { size: 'l', stock: 30, purchasedPrice: 0, sellingPrice: 0 },
       { purchasedPrice: 0, sellingPrice: 0, size: 'xl', stock: 7 } ],
    addedBy: 'rQVXK9Rn6qOZrIXfjURRgMCcNSr2',
    taxType: 'textile',
    isListable: true,
    isDeleted: false,
    brandName: 'reveera' }
function checkForChanges (_old_doc, _new_doc) {
  for (var key in _old_doc) {
    if (_old_doc[key] !== _new_doc[key]) {
      
    }
  }
}
