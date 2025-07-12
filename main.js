let heartBox = document.querySelectorAll('.Reactions  .hearts-box');
let imagPost = document.querySelectorAll('.card-header img');
let menuBtn = document.querySelector('.navbar-toggler');
let navBar = document.querySelector('.navbar-collapse');
let nav_item = document.querySelectorAll('.navbar-collapse .nav-item');
let posts_container = document.querySelector(".post #posts-container");

let fileInput = document.getElementById("file");
let fileZone = document.querySelector(".labelFile");

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
    axios.get(url + 'posts?limit=40')
    .then(response => {
        let posts = response.data.data;
        let fragment = '' ;
        for(post of posts){
                let content = `
                <div class="post-box d-flex p-2 ">
            <div class="user-image">
            <img class='focus-ring' src='${typeof post.author.profile_image === "string" && post.author.profile_image.length > 0
                ?post.author.profile_image 
                : "./images/world_16569394.png"}' alt="User avatar" loading="lazy" onerror="this.src='./images/world_16569394.png'" aria-live="polite" tabindex="0">
            </div>
            <div class="posts" style="width: 100%;">
        <div class="card">
            <div class="user-info ps-3">
                <span class="user-name info-text focus-ring" aria-live="polite" tabindex="0">${post.author.name || "none"}</span>
                <i class="bi bi-patch-check-fill"></i>
                <span class="username info-text focus-ring" aria-live="polite" tabindex="0">@${post.author.username || "none"}</span>
                <span class="post-history focus-ring" aria-live="polite" tabindex="0">${post.created_at.slice(0,4)}</span>
                <span class="user-sittings focus-ring" aria-live="polite" tabindex="0"><i class="bi bi-three-dots-vertical"></i></span>
            </div>
            <div class="card-body">
                ${post.title !== null ? `<span class="title focus-ring" aria-live="polite" tabindex="0">${post.title}</span>` : ""}
                ${post.body !== null ? `<span class="card-text focus-ring" aria-live="polite" tabindex="0">${post.body}</span>` : ""}
            </div>
        <div class="card-header"> 
            ${!post.image || Object.keys(post.image).length === 0 ? '' : `<img src="${post.image}" 
            alt="post Image" aria-live="polite" onerror="this.src='./images/transparent-background.png'" loading="lazy" tabindex="0" class='focus-ring'></img>`}
            <div class="Reactions">
            <div class="chat-box focus-ring" aria-live="polite" tabindex="0">
            <i class="bi bi-chat"></i>
            <span class="chat-count count focus-ring" aria-live="polite" tabindex="0">${post.comments_count}</span>
            </div>
            <div class="repost-box focus-ring" aria-live="polite" tabindex="0">
            <i class="bi bi-pencil-square"></i>
            <span class="repost-count count focus-ring" aria-live="polite" tabindex="0">0</span>
            </div>
            <div class="hearts-box focus-ring" aria-live="polite" tabindex="0">
            <i class="bi bi-heart"></i>
            <span class="hearts-count count focus-ring" aria-live="polite" tabindex="0">0</span>
            </div>
            <div class="share focus-ring" aria-live="polite" tabindex="0"><i class="bi bi-box-arrow-up-right"></i></div>
        </div>
        </div>


        </div>  
            </div>
            </div>
            
            `
            fragment += content;
            console.log(post)
        }
        posts_container.innerHTML = fragment;

    document.querySelectorAll(".card .card-header img").forEach(imgBody => {
    imgBody.addEventListener('error', () => {
        if (imgBody.src.endsWith("transparent-background.png")) {
            imgBody.remove();
        }
    });
});
    })


    function showAlert(message, type = "success"){
        if(!document.getElementById("success-alert")){
        const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.classList = 'show fade';
        wrapper.id = 'success-alert';
        wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    document.body.prepend(wrapper)
    }
    appendAlert(message,type);
    setTimeout(() => {
        const alertPlaceholder = document.getElementById('success-alert');
        alertPlaceholder.classList.remove("show")
        setTimeout(() => {
            alertPlaceholder.remove();
        },300)
    },2400)
        }
    }

    function setupUI(){
        const token = localStorage.getItem("token");
        let newPost = document.querySelector('.new-post');
        let buttonsRegister =  document.querySelectorAll(".status > button");
        let afterLogin = document.querySelector(".status .after-login");
        let profile_image = afterLogin.querySelector("img"); 
        if(token == null) // it means that User Is just a Guest 
        {
            afterLogin.classList.add("hidden");
            buttonsRegister.forEach(buttons => buttons.classList.remove("hidden") );
            if(newPost)newPost.remove();
        }else{
            buttonsRegister.forEach(buttons => buttons.classList.add("hidden") );
            afterLogin.classList.remove("hidden");
            let user = JSON.parse(localStorage.getItem("user")) ;
                if(typeof user.profile_image === "string" && user.profile_image.length > 0){
                    profile_image.alt `${user.username} Avatar`;
                    profile_image.src = user.profile_image ;
                }else{
                    profile_image.alt = `User Avatar`;
                    profile_image.src = "./images/822.jpg" ;
                }
            console.log(user.username)
            // create New Post Btn
            let new_post = document.createElement("div");
            new_post.classList = 'new-post focus-ring focus-ring-light';
            new_post.setAttribute("aria-live","polite");
            new_post.setAttribute("tabindex","0");
            // those data for open modal to create new post
            // data-bs-toggle="modal" data-bs-target="#login-modal"
            new_post.setAttribute("data-bs-toggle","modal")
            new_post.setAttribute("data-bs-target","#create-post-modal")
            // feather
            let feather = document.createElement("i");
            feather.classList = 'bi bi-feather';
            new_post.appendChild(feather);
            document.body.appendChild(new_post);
        }
    }

    // Events function Start

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
        setupUI();
        showAlert("Bye, our dear! Come back soon!",'danger');
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
            showAlert("You're in! Enjoy your time!");
        })
    }
    // 
    function registerBtnClicked(){
        let usernameRegister = document.getElementById("username-register-input");
        let nameRegister = document.getElementById("name-input");
        let passwordRegister = document.getElementById("password-register-input");
        if(usernameRegister.value.trim() !== ''
            &&nameRegister.value.trim() !== '' 
            && passwordRegister.value.trim() !== ''){
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
                fileZone.classList.remove("onDrop")
                showAlert('Your account is live! Time to explore!');
        }).catch((error) => {
            showAlert(error.response.data.message,"danger")
        })
        }
    }
    // hearts Count Start
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

posts_container.addEventListener('keydown', (event) => {
    if (event.target.classList.contains('hearts-box') && event.key === 'Enter') {
        event.target.click();
    }
});
// hearts count End

// drop image or select one start
fileZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    fileZone.classList.add("onDrop");
    if(fileZone.classList.contains("onDrop")){
        fileZone.querySelector("p").textContent = "Drop your profile image here!" ;
    }
});
fileZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    fileZone.classList.remove("onDrop");
});
fileZone.addEventListener('drop', function(e) {
    e.preventDefault();
    fileZone.classList.remove("onDrop");
    const files = e.dataTransfer.files;
    if (files.length > 1) {
        showAlert("Sorry, You Must select Just one Image","danger");
        fileZone.querySelector("p").textContent = 'Just one Image please';
    }else if(files.length > 0){
        const file = files[0]; // خد أول ملف بس
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files; // حط الملف في الـ input
        console.log('تم إسقاط ملف:', file.name);
        fileZone.querySelector("p").textContent = 'All set! Feel free to keep going now.'
    }
});
// drop image or select one End
    
// create New Post Clicked Function Start
    function createNewPostClicked() {
        showAlert("You are close inshallah")
    }
// create New Post Clicked Function End

// Events function End