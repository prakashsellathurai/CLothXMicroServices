### flipkart API rules to be followed 
## listing management api
#ENTRIES :
  -Listing: A listing is the fundamental sellable unit in the Flipkart Marketplace.
  -Package: A package refers to the physical attributes of the listing.
  -Location: Refers to your fulfillment locations. This is not applicable if you are planning to manage inventory via Flipkart.
#POST /listings/v3
  INPUT : 
     MANDATORY : 
       product_id                        - flipkart product Id
       price.mrp                         - max retial price
       price.sellingPrice                - seller price
       tax.hsn                           - harmonized system nomenclature for the product used to                                    determine   applicable taxrate
       tax.tax_code      - Flipkart’s tax code which decides the goods and services tax for the                       listing. Each tax_code internally maps to a Goods Services Tax (GST).                 Eg,tax_code GST_0 maps to 0% tax and GST_APPAREL maps to GST of apparels                      according to the final cart value. All tax-codes are available at                          MyListings page.
       listing_status                    -   Controls the listing’s visibility in the marketplace
       fulfillment_profile               - Fulfillment method for the listing
       fulfillment.shipping_provider     - Information on who will ship the item to the customer
       fulfillment.procurement_type      - Information on how the inventory is procured by the                                       seller  to fulfill an order
       packages[].name                   - Your identifier for the package. Max length: 64
       packages[].dimensions.length      - The length of the package in centimeters.
       packages[].dimensions.breadth     - The breadth of the package in centimeters.
       packages[].dimensions.height      - The heigth of the package in centimeters.
       packages[].notional_value.amount  - The value amount.
       packages[].notional_value.unit    - The unit of the amount
       locations                         - Your selling locations for this listing.
       locations[].id                    - The location ID obtained via the Onboarding API.
       locations[].status                - Controls the fulfillment of the product at this                                            location. If disabled,then orders will not be                                              fulfilled from this location.
       locations[].inventory             - The number of items you have in stock.
