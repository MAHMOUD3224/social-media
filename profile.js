    document.body.classList.toggle("theme", localStorage.getItem("darkMode") === "light");
    const urlId = new URLSearchParams(window.location.search)
    let userId = JSON.parse(decodeURIComponent(urlId.get("userId")))
    if(userId == true) userId = JSON.parse(localStorage.getItem('user'))
    updateUserStatus(userId,true)
    let user = JSON.parse(localStorage.getItem("user"));
    let posts_container = document.getElementById('posts-container')
    console.log(userId)
    getPosts()
    function getPosts(update = false){
        let url = 'https://tarmeezAcademy.com/api/v1/';
        let getPosts = `${url}users/${userId.id}/posts`;
        axios.get(getPosts)
        .then(response => {
                let posts = response.data.data.reverse();
                console.log(response.data.data)
                let editBtn   =  `` ;
                let deleteBtn =  `` ;
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
                    <img class='focus-ring' src='${typeof post.author.profile_image === "string" && post.author.profile_image.length > 0
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
                alt="${post.author.username}'s post img" aria-live="polite" onerror="this.remove()" loading="lazy" tabindex="0" class='img-body focus-ring'></img>`}
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
        })
        .catch((error) => showAlert(error.data.message))
        .finally(() => {
            setTimeout(() => {
                document.querySelector(".loading-test").classList.add("active"); 
                document.body.classList.remove("none-scroll");
            }, 300);
        })
    }


        document.getElementById('profileImg').addEventListener('click',(() => {
        if(!document.querySelector(".show-post-img")){
        imgDetails(document.getElementById('profileImg'))
        }
        }))

    postActions()
