document.body.classList.toggle("theme", localStorage.getItem("darkMode") === "light");
let imagPost = document.querySelectorAll('.card-header img');
let posts_container = document.querySelector(".post #posts-container");
let fileInputs = document.querySelectorAll(".input-file");
let fileZones = document.querySelectorAll(".labelFile");
        let updateBtn = document.getElementById("go-back");
        let currentPage = 1;
        let isLoading = false;
        let user = JSON.parse(localStorage.getItem("user"));

        
    getPosts();
    setupUI();
    
    let url = 'https://tarmeezAcademy.com/api/v1/';
    // get posts data to show in the main content.
    function getPosts() {
        if (isLoading) return;
            isLoading = true;
        let url = 'https://tarmeezAcademy.com/api/v1/';
        axios.get(url + `posts?limit=5&page=${currentPage}`)
            .then(response => {
                if(currentPage === response.data.meta.last_page) return ;
                let posts = response.data.data;
                console.log(response.data)
                let fragment = '' ;
                for(const post of posts){
                let content = `
                <div class="post-box d-flex p-2 " style="flex-wrap: wrap;" data-aos="zoom-in-up" id=post-${post.id}>
                    <div class="user-image">
                    <img class='focus-ring profile_img' src='${typeof post.author.profile_image === "string" && post.author.profile_image.length > 0
                ? post.author.profile_image 
                : "./images/user-profile.svg"}' alt="User avatar" loading="lazy" onerror="this.src='./images/user-profile.svg'" aria-live="polite" tabindex="0">
            </div>
            <div class="posts" style="flex: 1;">
                <div class="card">
                    <div class="user-info ps-3">
                        <span class="user-name info-text focus-ring" aria-live="polite" tabindex="0">${post.author.name || "none"}</span>
                        <i class="bi bi-patch-check-fill"></i>
                        <span class="username info-text focus-ring" aria-live="polite" tabindex="0">@${post.author.username || "none"}</span>
                        <span class="post-history focus-ring" aria-live="polite" tabindex="0">${post.created_at.replace(" ","").slice(0,3)}</span>
                        
                        <div class="btn-group">
                        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical" style='color:#0d6efd;'></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-lg-end">
                        <li class="dropdown-item" aria-live="polite" tabindex="0"><i class="bi bi-emoji-frown"></i>Not interested </li>
                        <li class="dropdown-item" aria-live="polite" tabindex="0"><i class="bi bi-person-add"></i>Follow @username </li>
                        <li class="dropdown-item" aria-live="polite" tabindex="0"><i class="bi bi-flag"></i>Report Post</li>
                        <li class="dropdown-item edit-option" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')"  aria-live="polite" tabindex="0"><i class="bi bi-pen"></i>edit Post</li>
                        <li class="dropdown-item delete-option"  aria-live="polite" tabindex="0"><i class="bi bi-trash"></i>Delete Post</li>
                        </ul>
                        </div>

                    </div>
                <div class="card-body" onclick="commentsPage(${post.id})">
                    ${post.title !== null ? `<span class="title focus-ring" aria-live="polite" tabindex="0">${post.title}</span>` : ""}
                    ${post.body !== null ? `<span class="card-text focus-ring" aria-live="polite" tabindex="0">${post.body}</span>` : ""}
                </div>
        <div class="card-header"> 
            ${!post.image || Object.keys(post.image).length === 0 ? '' : `<img src="${post.image}" 
            alt="post Image" aria-live="polite" onerror="this.src='./images/transparent-background.png'" loading="lazy" tabindex="0" class='img-body focus-ring'></img>`}
            <div class="Reactions">
            <div class="chat-box focus-ring" aria-live="polite" tabindex="0" onclick="commentsPage(${post.id})">
            <i class="bi bi-chat"></i>
            <span class="chat-count count">${post.comments_count}</span>
            </div>
            <div class="repost-box focus-ring focus-ring-success" aria-live="polite" tabindex="0">
            <i class="bi bi-pencil-square"></i>
            <span class="repost-count count">0</span>
            </div>
            <div class="hearts-box focus-ring focus-ring-danger" aria-live="polite" tabindex="0">
            <i class="bi bi-heart"></i>
            <span class="hearts-count count">0</span>
            </div>
            <div class="share focus-ring" aria-live="polite" tabindex="0"><i class="bi bi-box-arrow-up-right"></i></div>
        </div>
        </div>
        </div>  
        </div>
        <div class="comments-container" style="width: 100%;" id="comments-${post.id}">
            
        </div>
        </div>
            
            `
            fragment += content;
            console.log(post);
        }
            posts_container.innerHTML += fragment;
            document.querySelectorAll(".card .card-header img").forEach(imgBody => {
            imgBody.addEventListener('error', () => {
                    if (imgBody.src.endsWith("transparent-background.png")) {
                        imgBody.remove();
                    }
                
                });
            
            });
            currentPage++;
        })
        .finally(() => {
            isLoading = false;
        });
        
    }
    let postReplyLoading = false;
    function postReply(id) {
        if (postReplyLoading) return;
        postReplyLoading = true;
        let input = document.getElementById(`input-comment${id}`);
        const token = localStorage.getItem("token");
        if(!token) {
        showAlert("You must be logged in to post a comment", "danger");
        postReplyLoading = false;
        return;
        }else if(input.value.trim() === ""){
        showAlert("Please write a comment before posting", "danger");
        postReplyLoading = false;
        }
        else{
            const params = {
            "body": input.value
        }
        axios.post(`${url}posts/${id}/comments`, params, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            showAlert("Your comment has been posted successfully!");
            input.value = "";
            commentsPage(id);
        })
        .catch((error) => {
            console.log(error);
            showAlert(error.message, "danger");
        })
        .finally(() => {
            postReplyLoading = false;
        });
        
        }
    }
    let commentsLoading = false;        
    function commentsPage(id){
        console.log(id)
        let comments_container = document.querySelector(`#comments-${id}`);
        comments_container.classList.add("open");
        if (commentsLoading) return;
            commentsLoading = true;
            comments_container.innerHTML = "";
            axios.get(`${url}posts/${id}`)  
            .then((response) => {
            let comments = response.data.data.comments;
            let profileImg = user && user.profile_image && typeof user.profile_image === 'string' ? user.profile_image : "./images/user-profile.svg";
            let comment_box = `
                <div class="input-container" data-aos="fade-down">
                <div class="user-img"><img src="${profileImg}" onerror='this.src="./images/user-profile.svg"' alt="user avatar"></div>
                <input  type="text" id='input-comment${id}' class="input-comment" placeholder="Post your reply" onfocus="playSound()" aria-label="Post your reply">
                <button type="button" onclick='postReply(${id})' class="comment-btn">Reply</button>
            </div>`;
            
            if(comments.length === 0 ){
                comment_box += `<h3 class="no-comment"><i class="bi bi-info-circle" style="color: var(--bg-grey-color);"></i> No Comment yet! Be the first to Comment!</h3>`
                comments_container.innerHTML += comment_box;
                return;
            }else{

            for(const comment of comments){ 
                let timeAgo = getTimeAgo(comment.author.updated_at || comment.author.created_at);
                console.log(comment)
                comment_box += `
                <div class="comment" data-aos="fade-up">
                    <div class="user-img"><img src="${typeof comment.author.profile_image === "string" && comment.author.profile_image.length > 0
                ? comment.author.profile_image 
                : "./images/user-profile.svg"}" onerror= 'this.src="./images/user-profile.svg" ' alt="${comment.author.username || "none"} Avatar"></div>
                    <div class="comment-body" style="width: 100%;">
                        <div class="user-info">
                        <span class="user-name info-text focus-ring" aria-live="polite" tabindex="0">${comment.author.name || "none"}</span>
                        <i class="bi bi-patch-check-fill"></i>
                        <span class="username info-text focus-ring" aria-live="polite" tabindex="0">@${comment.author.username || "none"}</span>
                        <span class="post-history focus-ring" aria-live="polite" tabindex="0">${timeAgo}</span>
                        <span class="user-sittings focus-ring" aria-live="polite" tabindex="0"><i class="bi bi-three-dots-vertical"></i></span>
                        </div>
                        <p class="comment-text focus-ring" aria-live="polite" tabindex="0">${comment.body || ""}</p>
                    <div class="Reactions">
                       <div class="chat-box focus-ring" aria-live="polite" tabindex="0">
                        <i class="bi bi-chat"></i>
                        <span class="chat-count count">0</span>
                       </div>
                       <div class="repost-box focus-ring focus-ring-success" aria-live="polite" tabindex="0">
                        <i class="bi bi-pencil-square"></i>
                        <span class="repost-count count">0</span>
                       </div>
                       <div class="hearts-box focus-ring focus-ring-danger" aria-live="polite" tabindex="0">
                        <i class="bi bi-heart"></i>
                        <span class="hearts-count count">0</span>
                       </div>
                       <div class="share focus-ring" aria-live="polite" tabindex="0"><i class="bi bi-box-arrow-up-right"></i></div>
                       </div>
                    </div>
                </div>
                `;
            }
            comments_container.innerHTML += comment_box;
            }
            setupUI();
        })
        .catch((error) => {
            console.log(error)
            // showAlert(error.message, "danger");
        })
        .finally(() => {
            commentsLoading = false;
        });

    }
    let editIsLoading = false;
    // encodeURIComponent(JSON.stringify())
    function editPost(postObj){
        let post = JSON.parse(decodeURIComponent(postObj));
        let header = document.getElementById("post-modal-title");
        let title = document.getElementById("title-input");
        let body = document.getElementById("body-input");
        header.textContent = 'Edit Post';
        title.value = post.title || "" ;
        body.value = post.body || "" ;
        let post_modal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
        post_modal.toggle()
        console.log(post)
    }
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
    },2000)
        }
    }

const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !isLoading) {
        getPosts();
    }
}, { threshold: 0.1 });

const loadMoreElement = document.getElementById('load-more');
observer.observe(loadMoreElement);

    function setupUI(){
        // axios.get(`https://tarmeezacademy.com/api/v1/users/${user.id}`)
        // .then((response) => {
        // localStorage.setItem("user",JSON.stringify( response.data.data));
        // })
        const token = localStorage.getItem("token");
        user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        let newPost = document.querySelector('.new-post');
        let buttonsRegister =  document.querySelectorAll(".status .joinBtn");
        let logout = document.getElementById("logged-in");
        let ulProfile = document.querySelector(".user-actions ul")
        let profile_image = document.querySelector("#profileImg"); 
        let name = document.querySelector("#name");
        let username = document.querySelector("#username");
        let comments_count = document.querySelector(".comment-count");
        let posts_count = document.querySelector(".post-count");

        
        if(user){
            ulProfile.classList.remove("hidden");
            name.textContent = user.name ;
            username.textContent = `@${user.username}`;
            posts_count.textContent = user.posts_count + " Post";
            comments_count.textContent = user.comments_count + " Comment";
            if(user.profile_image && user.profile_image.length > 0){
            profile_image.src = user.profile_image;
            profile_image.alt = `${user.username} Avatar`;
            }
        }else{
            ulProfile.classList.add("hidden");
            name.textContent = "Name";
            username.textContent = "@username";
            profile_image.src = "./images/user-profile.svg";
            profile_image.alt = "User Avatar";
            posts_count.textContent = "0 Post";
            comments_count.textContent = "0 Comment";
        }
        if(token == null) // it means that User Is just a Guest 
        { 
            logout.classList.add("hidden");
            buttonsRegister.forEach(buttons => buttons.classList.remove("hidden") );
            if(newPost)newPost.remove();
        }else{
            buttonsRegister.forEach(buttons => buttons.classList.add("hidden") );
            logout.classList.remove("hidden");
            // create New Post Btn
            let new_post = document.createElement("div");
            new_post.classList = 'new-post focus-ring focus-ring-light';
            new_post.setAttribute("aria-live","polite");
            new_post.setAttribute("tabindex","0");
            // those data for open modal to create new post
            // data-bs-toggle="modal" data-bs-target="#login-modal"
            new_post.setAttribute("data-bs-toggle","modal")
            new_post.setAttribute("data-bs-target","#create-post-modal")
            new_post.setAttribute("onclick","playSound()")
            // feather
            let feather = document.createElement("i");
            feather.classList = 'bi bi-feather';
            new_post.appendChild(feather);
            document.body.appendChild(new_post);
        }

    }

    // Events function Start


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
            setupUI();
            
            let login_modal = document.getElementById("login-modal");
            const modalInstance = bootstrap.Modal.getInstance(login_modal);
            modalInstance.hide();
            showAlert("You're in! Enjoy your time!");
        })
    }
//-------------------- 
    function registerBtnClicked(){
        let usernameRegister = document.getElementById("username-register-input");
        let nameRegister = document.getElementById("name-input");
        let passwordRegister = document.getElementById("password-register-input");
        let fileInput = document.getElementById("file-register");

        if(usernameRegister.value.trim() !== ''
        &&nameRegister.value.trim() !== '' 
        && passwordRegister.value.trim() !== ''){
            let formData = new FormData();
            formData.append("username", usernameRegister.value);
            formData.append("password", passwordRegister.value);
            formData.append("name", nameRegister.value);
            if(fileInput.files.length >= 1) formData.append("image", fileInput.files[0]);
            
                const headers = {
                "Content-Type":"multipart/form-data"
            };
            let registerUrl = `${url}register`
            axios.post(registerUrl, formData, {headers:headers})
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
            console.log(error)
            showAlert(error.response.data.message,"danger")
        })
        }else{
            showAlert("Fill out the form","danger")
        }
    }
    // hearts Count Start
    posts_container.addEventListener('click', (event) => {
    let box = event.target.closest('.hearts-box');
    let repost_box = event.target.closest('.repost-box');
    let share = event.target.closest('.share');
    let imgBody = event.target.closest('.img-body');
    let post_box = event.target.closest('.post-box');
    let user_image = event.target.closest(".user-image");
    let user_info = event.target.closest(".user-info");
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
    if(imgBody && !document.querySelector(".show-post-img")){
        let show_post_img = document.createElement("div");
        show_post_img.classList.add("show-post-img");
        let imgPost = document.createElement("img");
        imgPost.src = imgBody.src ;
        show_post_img.appendChild(imgPost);
        let close = document.createElement("i");
        close.classList='close_btn bi bi-x-circle-fill'
        show_post_img.appendChild(close);
        document.body.classList.add("none-scroll");
        document.body.appendChild(show_post_img)
        show_post_img.addEventListener("click",removePostImg)
        function removePostImg(event){
            if(!event.target.closest("img")){
                show_post_img.remove();
                document.body.classList.remove("none-scroll");
            }
        }
    }

});

posts_container.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.target.click();
    }
});
// hearts count End
// drop image or select one start

fileZones.forEach((zone, index) => {
    let fileInput = fileInputs[index]; // ربط كل label بـ input معين

    zone.addEventListener('dragover', function(e) {
        e.preventDefault();
        zone.classList.add("onDrop");
        const p = zone.querySelector("p");
        p.textContent = "Drop your profile image here!";
        zone.querySelector("i").classList = 'bi bi-card-image';
    });

    zone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        zone.classList.remove("onDrop");
        const p = zone.querySelector("p");
        if (p) p.textContent = "You didn't drag or drop your profile image yet";
    });

    zone.addEventListener('drop', function(e) {
        e.preventDefault();
        imageHasSend(zone, e, 'drop', fileInput);
    });

    fileInput.addEventListener('change', function(e) {
        imageHasSend(zone, e, 'change', fileInput);
    });
});

function imageHasSend(zone, e, eventType, fileInput) {
    zone.classList.remove("onDrop");
    const p = zone.querySelector("p");
    const i = zone.querySelector("i");
    let files;

    if (eventType === 'drop') {
        files = e.dataTransfer.files;
    } else if (eventType === 'change') {
        files = e.target.files;
    }

    if (files.length > 1) {
        showAlert("Sorry, You Must select Just one Image", "danger");
        p.textContent = 'Just one Image please';
        i.classList = 'bi bi-card-image';
    } else if (files.length > 0) {
        const file = files[0];
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        console.log(`the image has been ${eventType === 'drop' ? 'dropped' : 'selected'}`, file.name);
        p.textContent = 'All set! Feel free to keep going now.';
        i.classList = 'bi bi-check2-square';
    }
}

function createNewPostClicked() {
    let titleInp = document.getElementById("title-input");
    let bodyInp = document.getElementById("body-input");
    let fileInput = document.getElementById("file-post");
    const token = localStorage.getItem("token");
    
    let formData = new FormData();
    formData.append("body", bodyInp.value)
    formData.append("title", titleInp.value)
    if(fileInput.files.length >= 1) formData.append("image", fileInput.files[0]);
    let newPostUrl = `${url}posts`;
    const headers = {
        "Content-Type":"multipart/form-data",
        "authorization": `Bearer ${token}`
    };
    axios.post(newPostUrl, formData, { headers: headers })
        .then((response) => {
            showAlert("Your post has been created")
            // getPosts();
                window.location.reload();
        })
        .catch((error) => {
            console.log(error.response.data.message)
            showAlert(error.response.data.message,"danger")
        })
        console.log(fileInput.files[0])
}
    // create New Post Clicked Function End

    // Dark/Light Mode Function
    function toggleDarkMode() { 
        const body = document.body;
        body.classList.toggle("theme");
        const isDarkMode = body.classList.contains("theme");
        localStorage.setItem("darkMode", isDarkMode ? "light" : "dark");
        playSound();
    }
    // Loading Function
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            document.querySelector(".loading-test").classList.add("active"); 
            document.body.classList.remove("none-scroll");
        }, 1300);
    });



function getTimeAgo(timestamp) {
    const commentTime = new Date(timestamp); 
    const now = new Date(); 
    const differenceInSeconds = Math.floor((now - commentTime) / 1000); 

    if (differenceInSeconds < 0) {
        return "invalid";
    }

    if (differenceInSeconds < 10) {
        return "now";
    }

    
    if (differenceInSeconds < 60) {
        return `${differenceInSeconds}s`; 
    } else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes}m`; 
    } else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours}h`; 
    } else {
        const days = Math.floor(differenceInSeconds / 86400);
        return `${days}d`; 
    }
}



