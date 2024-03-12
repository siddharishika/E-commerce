






const like=document.querySelectorAll('#like');
//console.log(like);
const sp=document.querySelector('.sp');

async function likebtn(id , btn){
    try{
        let response=await axios({
            method: 'post' ,
            url :  `/products/${id}/like` , 
            headers : {'X-Requested-With' : 'XMLHttpRequest'}
        })
       // console.log(response);
       if(btn.classList.contains('fa-solid')){
        btn.classList.remove('fa-solid');
        btn.classList.add('fa-regular');
       }else{
        btn.classList.remove('fa-regular');
        btn.classList.add('fa-solid');
       }
    }
    catch(e){
        window.location.replace('/login');
    }
}

for(let btn of like){
    btn.addEventListener('click' , (e)=>{
        let id= btn.getAttribute('pro-id');
        //console.log(ids);
         likebtn(id , btn);
    }) 
}


const a=document.querySelectorAll('#a');
const r=document.querySelectorAll('#r');
console.log(a);
for(let btn of a){
    btn.addEventListener('click' , async(e)=>{
        try{
                let id= btn.getAttribute('pro-id');
                
                //console.log(id);
                let response=await axios({
                method: 'post' ,
                url :  `/user/${id}/add`, 
                headers : {'X-Requested-With' : 'XMLHttpRequest'}
            })
           // console.log(response);
           let x = btn.parentElement.parentElement.lastElementChild;
           let y=(Number)(x.innerHTML);
           x.innerHTML=y+1;
        }
        catch(error){
            console.log(error);
        } 
    })
    
}
for(let btn of r){
    btn.addEventListener('click' , async(e)=>{
        try{
                let id= btn.getAttribute('pro-id');
                //console.log(id);
                let response=await axios({
                method: 'post' ,
                url :  `/user/${id}/remove`, 
                headers : {'X-Requested-With' : 'XMLHttpRequest'}
            })
           // console.log(response);
           let x = btn.parentElement.parentElement.lastElementChild;
           let y=Number(x.innerHTML);
           console.log(x);
           x.innerHTML=y-1;
        }
        catch(error){
            console.log(error);
        } 
    })
    
}























