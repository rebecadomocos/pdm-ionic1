# LAB1:
###### I have created a mobile app with ionic that will hold a list of foods 
###### food: id(string) name(string) price(numeric) expirationDate(date) inStock(boolean)

# Functionalities:
    * View food list
        -4 columns(id, name, price, expirationDate, inStock)
    * Add a food
        -using the plus button on the bottom-right corner
        -After clicking the "+" button you'll be redireted to a new page 
        where you can enter the properties of this new food you wish to add as follows:
        This page contains;
            - an input of type string( where you should enter the food name)
            - an input of type IonicCheckBox for the "InStock" label where you can select or diselect this option
            - an input of type date where you cand select "ExpirationDate" label value
            - an input of type number where you can select the value for "Price"
        -If you wish to add the new food in list you click on "SAVE" button on the top-right corner of the page
        -after a food is saved you'll be redirected back to the foods list page
        -you do not need to enter the id when adding a new food because it will be generated on server side
    