class APIFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword?      {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }:{}
        this.query = this.query.find({...keyword});
        return this;
    }
    filter(){
        const queryCopy={...this.queryStr}
        // console.log(queryCopy);
        const removeFields = ['keyword','limit','page']  
        removeFields.forEach(el=> delete queryCopy[el]); //removing this fileds from query
        // console.log(queryCopy);

        let queryStr = JSON.stringify(queryCopy);        //converting into string 
        queryStr= queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match => `$${match}`) // appending $ infront operators to use them as mongo operators
        // console.log(queryStr);
        this.query = this.query.find(JSON.parse(queryStr)); // converting into obj and finding them in products
        return this; 
    }

    pagination(productsPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const numOfProdToSkip = productsPerPage * (currentPage-1);

        this.query = this.query.limit(productsPerPage).skip(numOfProdToSkip)
        return this;
    }
} 

module.exports = APIFeatures;