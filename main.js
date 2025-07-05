let heartBox = document.querySelectorAll('.Reactions  .hearts-box');
let imagPost = document.querySelectorAll('.card-header img');
let menuBtn = document.querySelector('.navbar-toggler');
let navBar = document.querySelector('.navbar-collapse');
let nav_item = document.querySelectorAll('.navbar-collapse .nav-item');
let posts_container = document.querySelector(".post #posts-container");
let newPost = document.querySelector('.new-post');
    
        setupUI();
    // Toggle the navbar when the menu button is focused
    menuBtn.addEventListener("focus",toggleNavbar)
    nav_item.forEach(item => {
        item.addEventListener("click",toggleNavbar)
    })

    function toggleNavbar() {
        if (document.activeElement !== menuBtn) {
            menuBtn.click();
        }
    }
    // 

    // get posts data to show in the main content.
    let url = 'https://tarmeezAcademy.com/api/v1/';
    axios.get(url + 'posts?limit=10')
    .then(response => {
        let posts = response.data.data;
        let fragment = '' ;
        for(post of posts){
                let content = `
                <div class="post-box d-flex p-2 ">
            <div class="user-image">
            <img src="${post.author.profile_image || Object.keys(post.author.profile_image).length === 0 ?"./images/world_16569394.png" : post.author.profile_image}" alt="avatar">
            </div>
            <div class="posts" style="width: 100%;">
        <div class="card">
            <div class="user-info ps-3">
                <span class="user-name info-text">${post.author.name || "none"}</span>
                <i class="bi bi-patch-check-fill"></i>
                <span class="username info-text">@${post.author.username || "none"}</span>
                <span class="post-history">${post.created_at.slice(0,4)}</span>
                <span class="user-sittings"><i class="bi bi-three-dots-vertical"></i></span>
            </div>
            <div class="card-body">
                <span class="title">${post.title || ""}</span>
            <p class="card-text"> ${post.body || ""}</p>
        </div>
        <div class="card-header"> 
            ${!post.image || Object.keys(post.image).length === 0 ? '' : `<img src="${post.image}" alt="post Image"></img>`}
            <div class="Reactions ">
            <div class="chat-box">
            <i class="bi bi-chat "></i>
            <span class="chat-count count ">${post.comments_count}</span>
            </div>
            <div class="repost-box">
            <i class="bi bi-pencil-square"></i>
            <span class="repost-count count">0</span>
            </div>
            <div class="hearts-box">
            <i class="bi bi-heart"></i>
            <span class="hearts-count count">0</span>
            </div>
            <div class="share"><i class="bi bi-box-arrow-up-right "></i></div>
        </div>
        </div>


        </div>  
            </div>
            </div>
            
            `
            fragment += content;
        }
        posts_container.innerHTML = fragment;

    })
        // Loading Function
        document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            document.querySelector(".loading-test").classList.add("active"); 
        }, 2000);

    });

    // logout request Function
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setupUI()
    }
    // login request Function
    function loginBtnClicked(){
        let username = document.getElementById("username-input");
        let password = document.getElementById("password-input");
        console.log(username.value,password.value);

        const params = {
            "username": username.value,
            "password": password.value
        }
        const loginPost = `${url}login` ;
        axios.post(loginPost,params)  
        .then((response) => {
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("user",JSON.stringify(response.data.user));
            setupUI()
            let login_modal = document.getElementById("login-modal");
            const modalInstance = bootstrap.Modal.getInstance(login_modal);
            modalInstance.hide();
            showSuccessAlert();
        })
    }
    // 
    function registerBtnClicked(){
        let usernameRegister = document.getElementById("username-register-input");
        let nameRegister = document.getElementById("name-input");
        let passwordRegister = document.getElementById("password-register-input");

        let params = {
        "username": usernameRegister.value,
        "password": passwordRegister.value,
        "name": nameRegister.value,
        }
        let registerUrl = `${url}register`
        axios.post(registerUrl,params)
        .then((response) => {
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("user",JSON.stringify(response.data.user));
            setupUI()
            let register_modal = document.getElementById("registerModal");
            const modalInstance = bootstrap.Modal.getInstance(register_modal);
            modalInstance.hide();
        })
    }
    function showSuccessAlert(){
    const alertPlaceholder = document.getElementById('success-alert');
    alertPlaceholder.classList.add("show")

    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }
    appendAlert('Nice, You Triggered This alert message!','success');
    setTimeout(function(){
        alertPlaceholder.innerHTML = '';
        alertPlaceholder.classList.remove("show");
    },2000)
    }

    function setupUI(){
        const token = localStorage.getItem("token");
        
        let buttonsRegister =  document.querySelectorAll(".status > button");
        let afterLogin = document.querySelector(".status .after-login");
        
        if(token == null) // it means that User Is just a Guest 
        {
            afterLogin.classList.add("hidden");
            buttonsRegister.forEach(buttons => buttons.classList.remove("hidden") );
            newPost.classList.add("hidden");
        }else{
            buttonsRegister.forEach(buttons => buttons.classList.add("hidden") );
            afterLogin.classList.remove("hidden");
            newPost.classList.remove("hidden");
        }
    }

    
    posts_container.addEventListener('click', (event) => {
    let box = event.target.closest('.hearts-box');
    if (box) {
        let count = box.children[1];
        box.classList.toggle('active');
        if (box.classList.contains('active')) {
            count.textContent = parseInt(count.textContent) + 1;
            box.children[0].classList.add("active-child");
            box.children[1].classList.add("active-child");
            box.children[0].classList = 'bi bi-heart-fill active-child';
        } else {
            count.textContent = parseInt(count.textContent) - 1;
            box.children[0].classList.remove("active-child");
            box.children[1].classList.remove("active-child");
            box.children[0].classList = 'bi bi-heart';
        }
    }
});