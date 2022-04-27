export const baseUrl = "https://07c3-2402-800-63eb-5dbc-ed9f-e1f9-f59-5a9f.ap.ngrok.io/v1/api/"
export const GlobalUrl = Object.freeze({
    baseUrl : 'https://07c3-2402-800-63eb-5dbc-ed9f-e1f9-f59-5a9f.ap.ngrok.io/v1/api/',
    baseHostImageUrl : 'https://07c3-2402-800-63eb-5dbc-ed9f-e1f9-f59-5a9f.ap.ngrok.io/assets/img/',
    // baseHostAvatarUrl : 'http://localhost:8080/assets/avatar/',
    // baseHeaderImageUrl:'http://localhost:4200/assets/banner/',
    // baseI18nUrl:'http://localhost:4200/assets/i18n/',

    // get all products
    get_AllProduct:baseUrl+"product",
    get_AllProduct_By_CategorySub:baseUrl+"product/categorysub/",
    get_AllProduct_By_Name:baseUrl+"product/findbyname",
    get_Popular_Product:baseUrl+"product/popular",
    // get all category + subcategory
    get_AllCategory:baseUrl+"category",

    // get detailedproduct by detailedProductID + rating:comment,star,...
    get_DetailedProduct:baseUrl+"product",
    // get_DetailedProduct:"https://mini-food-shop-testing-default-rtdb.firebaseio.com/detailProduct",
    
    //sign-in sign-up forgot-pass
    post_signIn:baseUrl+"auth/signin",
    post_signUp:baseUrl+"auth/signup",
    post_forgot_password:baseUrl+'auth/forgot-password',
    get_logout:baseUrl+"auth/logout",
    //account
    put_update_profile:baseUrl+"auth/update/profile/",
    put_update_password:baseUrl+"auth/update/password/",

    //create invoice
    post_create_invoice:baseUrl+"cart",

    //get payment_log
    get_payment_log:baseUrl+"payment",

    //check exist email | phone | matched Password | ImportID
    post_isExistedEmail:baseUrl+"auth/check/email",
    post_isExistedPhone:baseUrl+"auth/check/phone",
    post_isMatchedPassword:baseUrl+"auth/check/password",
    post_isExistedImportID:baseUrl+"admin/check/importID",

    //new rating
    post_rating:baseUrl+'rating',
    post_rating_anonymous:baseUrl+'rating',
    post_rating_logged_in_user:baseUrl+'rating',

    //Files
    post_uploadFiles:baseUrl+'upload/file',
    get_Files:baseUrl+'files',

    /************************************************************************************************ */

    //Admin section
    get_AllUnitList:baseUrl+"unit_type",
    get_AllProduct_Admin:baseUrl+"admin/product",
    get_DetailedProduct_Admin:baseUrl+"admin/product",

    get_AllCategory_Admin:baseUrl+"admin/category",

    // get_AllImport_Admin:baseUrl+"admin/import",
    get_AllImport_Admin:baseUrl+"admin/import",

    // get_AllInvoice
    get_AllInvoice_Admin:baseUrl+"admin/payment",
    get_Invoice_TotalMoney_Admin:baseUrl+"admin/invoice/totalMoneyById",

    // get_AllAccount
    get_AllAccount_Admin:baseUrl+"admin/user",

    post_Add_Product:baseUrl+"admin/product",
    put_Update_Product:baseUrl+"admin/product",

    //Update Invoice item
    put_UpdateInvoiceItem:baseUrl+"admin/invoice/updateItem",
    put_UpdateInvoiceStatus:baseUrl+"admin/invoice/updateStatus",
    put_DeleteInvoiceItem:baseUrl+"admin/invoice/deleteItem",
    put_AddItemToInvoice:baseUrl+"admin/invoice/addItem",

    //remove collections
    delete_DeleteInvoice:baseUrl+"admin/invoice",
    delete_DeleteProduct:baseUrl+"admin/product",
    //Account
    post_AddAccount_Admin:baseUrl+"admin/account",
    put_EditAccount_Admin:baseUrl+"admin/account",
    delete_DeleteAccount:baseUrl+"admin/account",

    //Import
    post_AddImport_Admin:baseUrl+"admin/import",
    put_UpdateImport_Admin:baseUrl+"admin/import",
    put_UpdateImportInfo_Admin:baseUrl+"admin/importInfo",
    delete_DeleteImportInfoByItem_Admin:baseUrl+"admin/importInfo",

    //Statistics
    get_firstRowContent_Admin:baseUrl+"admin/statistics/firstRow",
    get_ProductSoldByCategory_Admin:baseUrl+"admin/statistics/secondRow",
    post_ProductSoldByCategory_Date_Range_Admin:baseUrl+"admin/statistics/secondRow/firstBarChartDateRange",

    get_IncomeByDate_Admin:baseUrl+"admin/statistics/secondRow/firstLineChartData",
    post_getDateRange_Admin:baseUrl+"admin/statistics/dateRange",

    get_InvoiceByStatus_Admin:baseUrl+"admin/statistics/thirdRow",

    get_ImportedByCategoryOverTheTime_Admin:baseUrl+"admin/statistics/thirdRow/importedByCate",
    get_ImportTimeGroupBy_Admin:baseUrl+"admin/statistics/thirdRow/importTimeGroupBy",
    get_ImportedExpenseByCategoryOverTheTime_Admin:baseUrl+"admin/statistics/thirdRow/importExpenseByCate",

    get_Revenue_Expense_Admin:baseUrl+"admin/statistics/fourthRow/expenseAndRevenueOverTheTime",
    get_Top_10_Sold_Admin:baseUrl+"admin/statistics/fourthRow/top10ProductSold",
    post_Top_10_Sold_Date_Range_Admin:baseUrl+"admin/statistics/fourthRow/top10ProductSoldByDateRange",

    get_company_position_level:baseUrl+"admin/statistics/fifthRow/companyPositionLevel",
    get_product_rating_Admin:baseUrl+"admin/statistics/fifthRow/productRating",

    get_Top_Customer:baseUrl+"admin/statistics/topCustomer",

    //Logs
    get_log_Admin:baseUrl+"admin/log",

    //Recover
    get_deleted_Account:baseUrl+"admin/userDeleted",
    get_deleted_Product:baseUrl+"admin/productDeleted",
    put_recover_Account:baseUrl+"admin/recoverAcc",
    put_recover_Product:baseUrl+"admin/recoverProd",

    
    //Admin section edge
})