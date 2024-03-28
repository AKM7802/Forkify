//import {loadRecipe} from "./model";


let start;
let end;
let pages;
let curPage=1;
let pageContent;
let pageRep=1;
let bookmarkBoolean;

let index;
let bookmarkedItems=[];

const swapbtn=document.querySelector('.swap_buttons')



const det = async function(){
    

    init()
    document.querySelector('.right_container').innerHTML=''
    //To read the content after hash from url
    const id=window.location.hash.slice(1);
   
    // const data=await loadRecipe(id)
    //FOR ORDINARY CONDITIONS
    //const link=await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)

    //FOR OUR ADDED RECIPE TO SHOW IN THE SEARCH RESULT
    const link=await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=06eb5a50-ccd5-42b7-8813-c0d5ff3b8fd1`)

    const json=await link.json();

    

    const jsond=json.data;
    
    const data=jsond.recipe;
    
    console.log(data.key)
    bookmarkBoolean=bookmarkedItems.some(item=>item.id === data.id);
    
    
    const html=`

    <div class="right_content">
    <div class="image_div">
        <div class="overlay"></div>
        <img src="${data.image_url}" class="image">
        <div class="heading"><span>${data.title}</span></div>
    </div>
    <div class="order_details">
        <div class="paras">
            <p class="time p"><span class="dct">${data.cooking_time}</span> MINUTES</p>
            <p class="servings"><span class="ds">${data.servings}</span> SERVINGS</p>
            <button class="subtract btn2">-</button>
            <button class="add btn2">+</button>
         </div>
         <div class="icons">
                <div class="friend circle ${data.key ? "" :'hidden'}"> <i class="fas fa-user"></i></div>
                <div class="bookmark circle" id="bm">${bookmarkBoolean ? `<i class="fas fa-bookmark"></i>` : `<i class="far fa-bookmark"></i>`}</div>
         </div>
         
        
    </div>
    <div class="recipe">
        <h2 class="recipe_head">RECIPE INGREDIENTS</h2>
        <div class="items">
        ${data.ingredients.map(function(dat){
           
           return `<p class="item">${dat.quantity} ${dat.unit} ${dat.description}</p>`
        }).join(' ')}
          
         
        </div>
     </div>
     <div class="tut">
         <h2 class="tut_head">HOW TO COOK IT</h2>
         <p class="tut_content">This recipe was carefully designed and tested by My Baking Addiction. Please <br>
         check out directions at their website.</p>
         <button class="tut_button">DIRECTIONS</button>
     </div>
</div>
    
    `
    document.querySelector('.right_container').insertAdjacentHTML("afterbegin",html)
      
    //Bookmark
   
    const bookmark=document.querySelector(".bookmark")
    bookmark.addEventListener("click",function(){
        bookmarkBoolean=bookmarkedItems.some(item=>item.id === data.id);
        if(!bookmarkBoolean) {
            bookmark.innerHTML=""
             bookmark.insertAdjacentHTML("afterbegin",`<i class="fas fa-bookmark"></i>`)
            
             
             bookmarkedItems.push(data)
        
        }else{
         bookmark.innerHTML=""
         bookmark.insertAdjacentHTML("afterbegin",`<i class="far fa-bookmark"></i>`)
         index=bookmarkedItems.findIndex(item=>item.id===data.id)
           
         bookmarkedItems.splice(index,1)

        }
        persistBookmark();
    })  




    //ADD AND SUBTRACT QUANTITY
    document.querySelector(".add").addEventListener("click",function(){
        const oldServe=data.servings
        data.servings+=1
        data.cooking_time+=1
        document.querySelector('.ds').innerHTML=data.servings
        document.querySelector('.dct').innerHTML=data.cooking_time;
        document.querySelector('.items').innerHTML=""
        document.querySelector('.items').insertAdjacentHTML("afterbegin",
            `${data.ingredients.map(function(dat){
                dat.quantity+=data.servings/oldServe;
                return `<p class="item">${dat.quantity.toFixed(2)} ${dat.unit} ${dat.description}</p>`
             }).join(' ')}`

        )
        
        
    })

    document.querySelector('.subtract').addEventListener("click",function(){
        const oldServe=data.servings
        data.servings-=1;
        data.cooking_time-=1
        document.querySelector(".ds").innerHTML=data.servings
        document.querySelector('.dct').innerHTML=data.cooking_time
        document.querySelector('.items').innerHTML=""
        document.querySelector('.items').insertAdjacentHTML("afterbegin",
            `${data.ingredients.map(function(dat){
                dat.quantity-=data.servings/oldServe;
                return `<p class="item">${dat.quantity.toFixed(2)} ${dat.unit} ${dat.description}</p>`
             }).join(' ')}`

        )
    })
    
    
    


}

window.addEventListener('load',det) //To render when we directly type the hash id
window.addEventListener('hashchange',det) //To render when we clink on some a tags 



const search= async function(){
   
    const item=document.querySelector('.search_input').value
    
    if(!item) return;
    
    //FOR REGuLAR CONDITIONs
    //const api=await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${item}`)

    //FOR OUR ADDED RECIPE TO SHOW ON THE SEARCH RESULT
    const api=await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${item}&key=06eb5a50-ccd5-42b7-8813-c0d5ff3b8fd1`)
    const json= await api.json()
    const recipe=json.data.recipes
    
    pageContent=recipe
    //Starting and end index to render selected items
   

    page(1);
}





const recipeRender=function(){
    
   pageContent.slice(start,end).forEach((res)=>{
       
   const html=`
    <a href="#${res.id}">
    <div class="block">
    <div class="round_img"><img class="image1" src="${res.image_url}"></div>
    <div class="names">
        <h3 class="item_name">${res.title}</h3>
        <p class="item_publisher">${res.publisher}</p>

    </div>
    
    </div>
    `
   
    document.querySelector('.L_items').insertAdjacentHTML("afterbegin",html);
    
    

})}

document.querySelector('.search_button').addEventListener("click",search)

//Page Sorting

const pageNumber=function(curPage){
    start=(curPage-1)*10;
    end=(curPage)*10;
}

const page=function(curPage){
    
    document.querySelector('.L_items').innerHTML=" "
    pageNumber(curPage);
    recipeRender()

     let pagesPresent=Math.ceil(pageContent.length/10)
     swapbtn.innerHTML='';
     

    
    if (pagesPresent>curPage && curPage==1){
        const html=`
            <div class="forward">
                <button class="forward_btn btn" id="frwd" data-pagenumber="${curPage+1}" >Page ${curPage+1}</button>
            </div>
        
        `
        swapbtn.insertAdjacentHTML("afterbegin",html)
        
        
    }

    if(curPage>1 && pagesPresent>curPage){
        const html=`
            <div class="backward">
                 <button class="backward_btn btn" data-pagenumber="${curPage-1}">Page ${curPage-1}</button>
            </div>
            <div class="forward">
                <button class="forward_btn btn" id="frwd" data-pagenumber="${curPage+1}" >Page ${curPage+1}</button>
            </div>
        
        `
        swapbtn.insertAdjacentHTML("afterbegin",html)
       

    }

    if(curPage>1 && pagesPresent===curPage){
        const html=`
            <div class="backward">
                 <button class="backward_btn btn" data-pagenumber="${curPage-1}">Page ${curPage-1}</button>
            </div>
            
        
        `
        swapbtn.insertAdjacentHTML("afterbegin",html)
       

    }
    //PAGE FORWARD
    document.querySelector('.forward').addEventListener("click",function(){
        let newPage=+document.querySelector('.forward_btn').dataset.pagenumber;
        
        page(newPage)
    })

    //PAGE BACKWARD
    document.querySelector('.backward')?.addEventListener("click",function(){
        let newPage=+document.querySelector('.backward_btn').dataset.pagenumber;
       
        page(newPage)
    })

   

}


//BOOKMARK COLUMN
const bmview=document.querySelector(".bookmarkContent")
document.querySelector(".bookmark_button").addEventListener("mouseover",function(){
    console.log(bookmarkedItems)
    bmview.style.visibility="visible";
    bookmarkFunction();
    
    

})

document.querySelector(".bookmarkContent").addEventListener("mouseleave",function(){
    bmview.style.visibility="hidden";
})



const bookmarkFunction=function(){
    if(bookmarkedItems.length===0){
        document.querySelector('.bookmarkContent').innerHTML="<h4 class=\"bcHeading\">Nothing bookmarked yet.</h4>";
        return
    }
    document.querySelector('.bookmarkContent').innerHTML="";
    bookmarkedItems.forEach((res)=>{
       
        const html=`
         <a href="#${res.id}">
         <div class="block">
         <div class="round_img"><img class="image1" src="${res.image_url}"></div>
         <div class="names">
             <h3 class="item_name">${res.title}</h3>
             <p class="item_publisher">${res.publisher}</p>
     
         </div>
         
         </div>
         </a>
         `
        
         document.querySelector('.bookmarkContent').insertAdjacentHTML("afterbegin",html);
         
         
     
     })


}


//ADD RECIPE
document.querySelector('.recipe_button').addEventListener('click',function(){
    
    document.querySelector('.overlayMain').classList.remove('hidden');
    document.querySelector('.upload').classList.remove("hidden")

})

document.querySelector('.close_button').addEventListener('click',function(){
    document.querySelector('.overlayMain').classList.add('hidden');
    document.querySelector('.upload').classList.add("hidden")
})

document.querySelector('.grid_system').addEventListener("submit",function(e){
    e.preventDefault()
    const dataArr=[...new FormData(this)] // TO FETCH AND CONVERT THE DATA SUBMITTED IN FORM
    const data=Object.fromEntries(dataArr) //TO CONVERT ARRAY TO OBJECT
    uploadRecipe(data)

})


const uploadRecipe=async function(newRecipe){
    // const ingredients=Object.entries(newRecipe) //CONVERT OBJECT TO ARRAY
    

    const ingredients=Object.entries(newRecipe).filter(entry=>entry[0].startsWith("ing") && entry[1]!=="").
    map(item=>{
        const [quantity,unit,description]= item[1].replaceAll(" ","").split(',');
        return {quantity: quantity? +quantity : null,unit,description}
    })

    const recipe={
        title:newRecipe.title,
        source_url:newRecipe.url,
        image_url:newRecipe.image,
        publisher:newRecipe.publisher,
        cooking_time: +newRecipe.prepTime,
        servings: +newRecipe.servings,
        ingredients


    }
   
    //SENT JSON TO SERVER
    //FORMAT
    // const link=fetch(url, {
    //     method:"POST",
    //     headers:{
    //         'Content-Type':'application/json',
    //     },
    //     body: JSON.stringify(uploadData),
    // });

    // const json=await link.json();


    const link= await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/?key=06eb5a50-ccd5-42b7-8813-c0d5ff3b8fd1`, {
        method:"POST",
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify(recipe),
    });

    const json=await link.json();
    const jsond=json.data;
    const data=jsond.recipe;
    


   
    console.log(data)
    bookmarkBoolean=true
    bookmarkedItems.push(data)
    const html=`

    <div class="right_content">
    <div class="image_div">
        <div class="overlay"></div>
        <img src="${data.image_url}" class="image">
        <div class="heading"><span>${data.title}</span></div>
    </div>
    <div class="order_details">
        <div class="paras">
            <p class="time p"><span class="dct">${data.cooking_time}</span> MINUTES</p>
            <p class="servings"><span class="ds">${data.servings}</span> SERVINGS</p>
            <button class="subtract btn2">-</button>
            <button class="add btn2">+</button>
         </div>
         <div class="icons">
                <div class="friend circle ${data.key ? "" :'hidden'}"> <i class="fas fa-user"></i></div>
                <div class="bookmark circle" id="bm">${bookmarkBoolean ? `<i class="fas fa-bookmark"></i>` : `<i class="far fa-bookmark"></i>`}</div>
         </div>
         
        
    </div>
    <div class="recipe">
        <h2 class="recipe_head">RECIPE INGREDIENTS</h2>
        <div class="items">
        ${data.ingredients.map(function(dat){
           
           return `<p class="item">${dat.quantity} ${dat.unit} ${dat.description}</p>`
        }).join(' ')}
          
         
        </div>
     </div>
     <div class="tut">
         <h2 class="tut_head">HOW TO COOK IT</h2>
         <p class="tut_content">This recipe was carefully designed and tested by My Baking Addiction. Please <br>
         check out directions at their website.</p>
         <button class="tut_button">DIRECTIONS</button>
     </div>
</div>
    
    `
    document.querySelector('.right_container').innerHTML=''
    document.querySelector('.right_container').insertAdjacentHTML("afterbegin",html)
    
    
  
    
        

    document.querySelector('.overlayMain').classList.add('hidden');
    document.querySelector('.upload').classList.add("hidden")



    //Bookmark
   
    const bookmark=document.querySelector(".bookmark") 
    bookmark.addEventListener("click",function(){
        bookmarkBoolean=bookmarkedItems.some(item=>item.id === data.id);
        if(!bookmarkBoolean) {
            bookmark.innerHTML=""
             bookmark.insertAdjacentHTML("afterbegin",`<i class="fas fa-bookmark"></i>`)
            
             
             bookmarkedItems.push(data)
        
        }else{
         bookmark.innerHTML=""
         bookmark.insertAdjacentHTML("afterbegin",`<i class="far fa-bookmark"></i>`)
         index=bookmarkedItems.findIndex(item=>item.id===data.id)
           
         bookmarkedItems.splice(index,1)

        }
        persistBookmark();
    })  




    //ADD AND SUBTRACT QUANTITY
    document.querySelector(".add").addEventListener("click",function(){
        const oldServe=data.servings
        data.servings+=1
        data.cooking_time+=1
        document.querySelector('.ds').innerHTML=data.servings
        document.querySelector('.dct').innerHTML=data.cooking_time;
        document.querySelector('.items').innerHTML=""
        document.querySelector('.items').insertAdjacentHTML("afterbegin",
            `${data.ingredients.map(function(dat){
                dat.quantity+=data.servings/oldServe;
                return `<p class="item">${dat.quantity.toFixed(2)} ${dat.unit} ${dat.description}</p>`
             }).join(' ')}`

        )
        
        
    })

    document.querySelector('.subtract').addEventListener("click",function(){
        const oldServe=data.servings
        data.servings-=1;
        data.cooking_time-=1
        document.querySelector(".ds").innerHTML=data.servings
        document.querySelector('.dct').innerHTML=data.cooking_time
        document.querySelector('.items').innerHTML=""
        document.querySelector('.items').insertAdjacentHTML("afterbegin",
            `${data.ingredients.map(function(dat){
                dat.quantity-=data.servings/oldServe;
                return `<p class="item">${dat.quantity.toFixed(2)} ${dat.unit} ${dat.description}</p>`
             }).join(' ')}`

        )
    })
    
   
    //CHANGE URL
    window.history.pushState(null,'',`#${data.id}`)


}


//Function to store items in local storage

const persistBookmark=function(){
            localStorage.setItem('bookmark',JSON.stringify(bookmarkedItems))

};


//Function to get items from local storage

const init=function(){
    const storage=localStorage.getItem('bookmark');
    if(storage) bookmarkedItems=JSON.parse(storage);

}







 
  
      
      
   