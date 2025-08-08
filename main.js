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
        
        // get posts data to show in the main content.
        function getPosts(update = false) {
            if (isLoading) return;
                isLoading = true;
                if(update == true) currentPage = 1 ;
            let url = 'https://tarmeezAcademy.com/api/v1/';
            axios.get(url + `posts?limit=5&page=${currentPage}`)
                .then(response => {
                    if(currentPage === response.data.meta.last_page) return ;
                    let posts = response.data.data;
                    console.log(response.data)
                    let editBtn = `` ;
                    let deleteBtn = `` ;
                    let fragment = '' ;
                    for(const post of posts){
                    if(JSON.parse(localStorage.getItem("user")) != null && post.author.id == JSON.parse(localStorage.getItem("user")).id){
                        editBtn = `<li class="dropdown-item edit-option" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')"  aria-live="polite" tabindex="0"><i class="bi bi-pen"></i>edit Post</li>`
                        deleteBtn = `<li class="dropdown-item delete-option" onclick='getPostId(${post.id})' data-bs-toggle="modal" data-bs-target="#deleteModal" data-post="${encodeURIComponent(JSON.stringify(post))}" aria-live="polite" tabindex="0"><i class="bi bi-trash"></i>Delete Post</li>`
                    }else{
                        editBtn = '';
                        deleteBtn = '';
                    }
                    let content = `
                    <div class="post-box d-flex p-2 " style="flex-wrap: wrap;" data-aos="zoom-in-up" id=post-${post.id}>
                        <div class="user-image">
                        <img class='focus-ring  profile_img' data-userinfo='${encodeURIComponent(JSON.stringify(post.author))}' src='${typeof post.author.profile_image === "string" && post.author.profile_image.length > 0
                    ? post.author.profile_image 
                    : "./images/user-profile.svg"}' alt="${post.author.username}'s Avatar" loading="lazy" onerror="this.src='./images/user-profile.svg'" aria-live="polite" tabindex="0">
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
                            ${editBtn}
                            ${deleteBtn}
                            </ul>
                            </div>

                        </div>
                    <div class="card-body body-post" data-comment='${post.id}'>
                        ${post.title !== null ? `<span class="title focus-ring" aria-live="polite" tabindex="0">${post.title}</span>` : ""}
                        ${post.body !== null ? `<span class="card-text focus-ring" aria-live="polite" tabindex="0">${post.body}</span>` : ""}
                    </div>
            <div class="card-header"> 
                ${!post.image || Object.keys(post.image).length === 0 ? '' : `<img src="${post.image}" 
                alt="${post.author.username}'s post Image" aria-live="polite" onerror="this.remove()" loading="lazy" tabindex="0" class='img-body focus-ring'></img>`}
                <div class="Reactions">
                <div class="chat-box focus-ring" aria-live="polite" tabindex="0" data-comment='${post.id}'>
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
            if(update == true){
                posts_container.innerHTML = fragment;
            }else{
                posts_container.innerHTML += fragment;
            }
                // document.querySelectorAll(".card .card-header img").forEach(imgBody => {
                // imgBody.addEventListener('error', () => {
                //         if (imgBody.src.endsWith("transparent-background.png")) {
                //             imgBody.remove();
                //         }
                    
                //     });
                // });
                currentPage++;
            })
            .catch((error) => showAlert(error.data.message))
            .finally(() => {
                isLoading = false;
            });
            
        }



    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading) {
            getPosts();
        }
    }, { threshold: 0.1 });

    const loadMoreElement = document.getElementById('load-more');
    observer.observe(loadMoreElement);
        function setupUI(){
            const token = localStorage.getItem("token");
            user = JSON.parse(localStorage.getItem("user"));

            console.log(user);
            let newPost = document.querySelector('.new-post');
            let buttonsRegister =  document.querySelectorAll(".status .joinBtn");
            let logout = document.getElementById("logged-in");

            updateUserStatus(user)
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

                // feather
                let feather = document.createElement("i");
                feather.classList = 'bi bi-feather';
                new_post.appendChild(feather);
                document.body.appendChild(new_post);
            }
            showUserProfile();
        }

        // Events function Start


        // logout request Function
        document.getElementById("logged-in").addEventListener('click', logout)
        function logout() {
            playSound()
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setupUI();
            showAlert("Bye, our dear! Come back soon!",'danger');
        }
        document.getElementById('login-button').addEventListener('click', loginBtnClicked)
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
                getPosts(true)
                showAlert("You're in! Enjoy your time!");
            })
        }
    //--------------------
        document.getElementById('registerButton').addEventListener('click', registerBtnClicked)
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
                    getPosts(true)
                    showAlert('Your account is live! Time to explore!');
            }).catch((error) => {
                console.log(error)
                showAlert(error.data.message,"danger");
            })
            }else{
                showAlert("Fill out the form","danger")
            }
        }
        postActions();
        // hearts Count Start

    // hearts count End
    // drop image or select one start

    fileZones.forEach((zone, index) => {
        let fileInput = fileInputs[index]; // ربط كل label بـ input معين

        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            zone.classList.add("onDrop");
            const p = zone.querySelector("p");
            p.textContent = "Drop your image here!";
            zone.querySelector("i").classList = 'bi bi-card-image';
        });

        zone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            zone.classList.remove("onDrop");
            const p = zone.querySelector("p");
            if (p) p.textContent = "You didn't drag or drop your image yet";
        });

        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            imageHasSend(zone, e, 'drop', fileInput);
        });

        fileInput.addEventListener('change', function(e) {
            imageHasSend(zone, e, 'change', fileInput);
        });
    });


    document.getElementById("send-post").addEventListener('click', createNewPostClicked)
    let isNewPostLoading = false ;
    function createNewPostClicked() {
        let titleInp = document.getElementById("title-input");
        let bodyInp = document.getElementById("body-input");
        let header = document.getElementById("post-modal-title");
        let fileInput = document.getElementById("file-post");
        
        let idInput = document.getElementById("post-id-input");
        
        const token = localStorage.getItem("token");

        let isCreate = idInput.value == null || idInput.value == "";
        

        if(isNewPostLoading) return;
        isNewPostLoading = true;
        console.log(titleInp.value)
        let formData = new FormData();
        formData.append("body", bodyInp.value)
        if(titleInp.value.trim() != '' || titleInp.value != null){
            formData.append("title", titleInp.value)
        }else{
            formData.append("title", null)
        }
        console.log(titleInp.value)
        if(fileInput.files.length >= 1) formData.append("image", fileInput.files[0]);

        let newPostUrl = ``;
        const headers = {
            "Content-Type":"multipart/form-data",
            "authorization": `Bearer ${token}`
        };
        if(isCreate){
            newPostUrl = `${url}posts`;

        }else{
            formData.append("_method","put");
            newPostUrl = `${url}posts/${idInput.value}`;
        }
                axios.post(newPostUrl, formData, { headers: headers })
            .then((response) => {
                getPosts(true);
                
            })
            .catch((error) => {
                console.log(error.data.message)
                showAlert(error.data.message,"danger")
            })
            .finally((fin) => {
                titleInp.value = '';
                bodyInp.value = '' ;
                idInput.value = ''
                let post_modal = bootstrap.Modal.getInstance(document.getElementById("create-post-modal"));
                post_modal.hide()
                isNewPostLoading = false;
            })

    }
    // create New Post Clicked Function End
    


        if(document.querySelector('.new-post')){
        document.querySelector('.new-post').addEventListener('click', addPost)
        }
        function addPost(){
            playSound();
            let header = document.getElementById("post-modal-title");
            let title = document.getElementById("title-input");
            let body = document.getElementById("body-input");
            title.value = "" ;
            body.value =  "" ;
            header.textContent = 'Create A New Post' ;
            document.getElementById('send-post').textContent = 'Post'
            let idInput = document.getElementById("post-id-input");
            idInput.value = '' ;  

            let post_modal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
            post_modal.show()
        }
        document.getElementById('toggleButton').addEventListener('click', toggleDarkMode)
        // Dark/Light Mode Function
        function toggleDarkMode() { 
            const body = document.body;
            body.classList.toggle("theme");
            const isDarkMode = body.classList.contains("theme");
            localStorage.setItem("darkMode", isDarkMode ? "light" : "dark");
            playSound();
        }
        showUserProfile();
        function showUserProfile() { 
            document.querySelectorAll('.go-to-profile').forEach(el => {
                let userClick;
                if(user && localStorage.getItem('token')){
                    el.setAttribute('data-userinfo', `${encodeURIComponent(JSON.stringify(true))}`);
                    userClick = () => goToProfilePage(el) ;
                }else{
                    el.removeAttribute('data-userinfo');
                    userClick = () => showAlert("It seems that you haven't created an account with us yet. 🤔", "info") ;
                }
                el.addEventListener('click', userClick)
            })
        }

    
    loadingPage()
    