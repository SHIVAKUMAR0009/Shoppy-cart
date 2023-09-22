const produ=document.querySelector('.products-center   ')
const updateditem=document.querySelector('.cart-items');
const cartcontent=document.querySelector('.cart-content');
const total=document.querySelector('#total')
const cartt=document.querySelector('.cartt')
const overlay=document.querySelector('.cart-overlay')
const btn=document.querySelector('#close')
const cbtn=document.querySelector('#carticon')
const clall=document.querySelector('.clearall')
let cart=[]
let buttondom=[]
class products{
   async getproducts(){
      const response=await fetch('products.json')
     const data= await response.json()
   const result=data.items
//    console.log(result)
   const prs=result.map((item)=>{

    const {title,price}=item.fields
   const id= item.sys.id;
  const urll= item.fields.image.fields.file.url
//   console.log(urll)
return {title,price,id,urll}
   })
   return prs
   }
}
class loadproducts{
loadproduct(datas){
  let resultt=[];
// console.log(datas)
datas.forEach(product => {
   resultt+=`<article class="items">
<div class="img-container">
    <img src="${product.urll}" id="imgg">
    <button class="btnn" id=${product.id}>Addtobag</button>
</div>
<span><h3>${product.title}</h3></span>
<h4>$${product.price} </h4>

    </article>
   `
   
});
// console.log(produ)
produ.innerHTML=resultt

}
getbagbtn(){
const allbtns=[...document.querySelectorAll('.btnn')];
buttondom=allbtns
console.log(buttondom)
allbtns.forEach((btn)=>{
const idd=btn.id

const iscart=cart.find(item=>item.id===idd)
if(iscart){
   btn.innerText="incart";
   btn.disabled=true;

}
   btn.addEventListener('click',(e)=>{
      e.target.innerText='incart'
      e.target.disabled=true;
      let caritem={...storage.getproducts(idd),amount:1}; 
    cart=[...cart,caritem]
   //  console.log(cart)
     storage.savecart(cart)
this.setcartvalues(cart)
     this.additem(caritem)
this.showcart()

   })

})
}
setcartvalues(cart){
   // console.log(cart)
   let moneytotal=0;
   let itemtotal=0;
   cart.forEach((item)=>{
      // console.log(item)
      moneytotal+=item.price*item.amount;
      itemtotal+=item.amount;
   
   })
updateditem.innerText=itemtotal;
total.innerText=`Your total is :$    ${parseFloat(moneytotal.toFixed(2))}`
}

additem(item){
   const div=document.createElement('div')
   div.classList.add('cart-item') 
     
   // div.classList.add('cart-item')
   div.innerHTML=`
   <img src="${item.urll}" id="imggg" >
   <div class="divv">
<h3 >${item.title}</h3> 
<h4> $ ${item.price}</h4> 

 <span class="remove" data-id=${item.id}>remove</span>
</div>
<div>
<i class="fa-solid fa-plus" data-id=${item.id}></i>
<p class="item-amount">${item.amount}</p>
<i class="fa-solid fa-minus" data-id=${item.id}></i>
</div>`
   
cartcontent.appendChild(div)
// console.log(cartcontent)
}
showcart(){
overlay.classList.add('transparentbcg')
cartt.classList.add('showcartt')

}
setupcart(){
cart=storage.getcart();
this.setcartvalues(cart);
this.populatecart(cart)

}
populatecart(cart){
   cart.forEach(item=>this.additem(item))
}
cartlogic(){
   clall.addEventListener('click',()=>{
      this.clearcart()}/////clearall
   )
   cartcontent.addEventListener('click',(e)=>{
      if(e.target.classList.contains("remove")){
  let  removeitem= e.target
  let rid=removeitem.dataset.id
cartcontent.removeChild(removeitem.parentElement.parentElement)
this.removeitem(rid)

      }else if(e.target.classList.contains("fa-plus")){
         let plusbtn=e.target
         // console.log(plusbtn)
         let pid=plusbtn.dataset.id
         let citem=cart.find(item=>item.id===pid)
citem.amount=citem.amount+1;
storage.savecart(cart)
this.setcartvalues(cart)
plusbtn.nextElementSibling.innerText=citem.amount

      }
      else if(e.target.classList.contains('fa-minus')){
        let minusbtn= e.target
let mid=minusbtn.dataset.id
let mitem=cart.find(item=>item.id===mid)
// console.log(mitem)
mitem.amount=mitem.amount-1;
// console.log(mitem)
if(mitem.amount>0){
storage.savecart(cart)
this.setcartvalues(cart)
minusbtn.previousElementSibling.innerText=mitem.amount
}else{
   cartcontent.removeChild(minusbtn.parentElement.parentElement)
   this.removeitem(mid)
}
      }
   })
}



clearcart(){
  let cartitems=cart.map(item=>item.id)
//   console.log(cartitems)
cartitems.forEach(id=>this.removeitem(id))
while(cartcontent.children.length>0){
   cartcontent.removeChild(cartcontent.children[0])
}
}

removeitem(id){
   // console.log(id)
   // console.log(cart)
   cart=cart.filter(item=>item.id!==   id)
   //  console.log(cart)
   this.setcartvalues(cart)
   storage.savecart(cart)
   let buttton=this.getsinglebtn(id)
   buttton.disabled=false;
   buttton.innerText="Addtocart"
}
getsinglebtn(id){
   return buttondom.find(btn=>btn.id===id)
}

}
const closecart=()=>{
   overlay.classList.remove('transparentbcg')
   overlay.classList.add('cart-overlay')
   cartt.classList.remove('showcartt')
   cartt.classList.add('cartt')
}
class storage{
   static store(products){
      localStorage.setItem('products',JSON.stringify(products));
   }
   static getproducts(id){
      let products=JSON.parse(localStorage.getItem('products'))
      return products.find(product=>product.id===id)
   }
   static savecart(cart){
      localStorage.setItem('cart',JSON.stringify(cart))
   }
   static getcart(){
   return  localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart'))
      :[]
   }
}


const lproducts=new loadproducts()

document.addEventListener("DOMContentLoaded",()=>{
   const myproduct =new products()
   // myproduct.getproducts()
   lproducts.setupcart();
   myproduct.getproducts(). then(data=>{
      lproducts.loadproduct(data)
          storage.store(data)
          
}).then(()=>{
   lproducts.getbagbtn();
   lproducts.cartlogic();
})

})

cbtn.onclick=()=>lproducts.showcart();
btn.onclick=()=>closecart();

