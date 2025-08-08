let url = 'https://tarmeezAcademy.com/api/v1/';
 function updateUserStatus(user, userProfile = false) { 
    let ulProfile = document.querySelector(".user-actions ul")
    let name = document.querySelector("#name");
    let username = document.querySelector("#username");
    let posts_count = document.querySelector(".post-count");
    let comments_count = document.querySelector(".comment-count");
    let profile_image = document.querySelector("#profileImg"); 
    if(user){
    console.log(user)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${user.id}`)
    .then((response) => {
        let userData = response.data.data
        if(userProfile === false){
            localStorage.setItem("user",JSON.stringify( response.data.data));
        }
        if(userProfile){
            document.querySelector('meta[name="description"]').setAttribute('content', `Profile page of ${userData.name}. Connect and share updates!`);
            document.querySelector('meta[property="og:title"]').setAttribute('content', `${userData.name}'s Profile | Social Media App`);
            document.querySelector('meta[property="og:description"]').setAttribute('content', `Check out ${userData.name}'s profile and posts.`);
            document.querySelector('meta[property="og:image"]').setAttribute('content', userData.profile_image || './images/world_16569394.png');
            //  todo: we must remove comment on this code above to share the user's profile link
            // document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
        }
        if(ulProfile)ulProfile.classList.remove("hidden");
        name.textContent = userData.name ;
        username.textContent = `@${userData.username}`;
        posts_count.textContent = userData.posts_count + " Post";
        comments_count.textContent = userData.comments_count + " Comment";
        if(userData.profile_image && userData.profile_image.length > 0){
        profile_image.src = userData.profile_image;
        profile_image.alt = `${userData.username} Avatar`;
        }

    })
    .catch((error) => {
        console.log(error)
        showAlert(error.message,"danger");
        if(ulProfile) ulProfile.classList.add("hidden") ;
        name.textContent = "Name";
        username.textContent = "@username";
        posts_count.textContent = "0 Post";
        comments_count.textContent = "0 Comment";
        profile_image.src = "./images/user-profile.svg";
        profile_image.alt = "User Avatar";
    })
    }else{
        if(ulProfile) ulProfile.classList.add("hidden") ;
        name.textContent = "Name";
        username.textContent = "@username";
        posts_count.textContent = "0 Post";
        comments_count.textContent = "0 Comment";
        profile_image.src = "./images/user-profile.svg";
        profile_image.alt = "User Avatar";
    }
}

// Loading Function
 function loadingPage(){
    document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector(".loading-test").classList.add("active"); 
        document.body.classList.remove("none-scroll");
    }, 1000);
    
});
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
                comments_container.innerHTML = "<h4 style='text-align: center; padding:30px'>waiting for comments </h4>";
                axios.get(`${url}posts/${id}`)  
                .then((response) => {
                comments_container.innerHTML = '' ;
                let comments = response.data.data.comments;
                let profileImg = user && user.profile_image && typeof user.profile_image === 'string' ? user.profile_image : "./images/user-profile.svg";
                let comment_box = `
                    <div class="input-container" data-aos="fade-down">
                    <div class="user-img "><img src="${profileImg}" onerror='this.src="./images/user-profile.svg"' alt="user avatar"></div>
                    <input  type="text" id='input-comment${id}' class="input-comment" placeholder="Post your reply" onfocus="playSound()" aria-label="Post your reply">
                    <button type="button" data-commentid='${id}' class="comment-btn">Reply</button>
                </div>`;
                
                if(comments.length === 0 ){
                    comment_box += `<h3 class="no-comment"><i class="bi bi-keyboard" style="color: var(--bg-grey-color); font-size:2rem"></i> Be the first to comment!</h3>`
                    comments_container.innerHTML += comment_box;
                    return;
                }else{

                for(const comment of comments){ 
                    let timeAgo = getTimeAgo(comment.author.updated_at || comment.author.created_at);
                    console.log(comment)
                    comment_box += `
                    <div class="comment" data-aos="fade-up">
                        <div class="user-img"><img class='profile_img' data-userinfo='${encodeURIComponent(JSON.stringify(comment.author))}' src="${typeof comment.author.profile_image === "string" && comment.author.profile_image.length > 0
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
            })
            .catch((error) => {
                console.log(error)
                // showAlert(error.message, "danger");
            })
            .finally(() => {
                commentsLoading = false;
                updateUserStatus(JSON.parse(localStorage.getItem('user')));
                
            });
        }
        

        function postActions(){
        posts_container.addEventListener('click', (event) => {
        let box = event.target.closest('.hearts-box');
        let repost_box = event.target.closest('.repost-box');
        let share = event.target.closest('.share');
        let imgBody = event.target.closest('.img-body');
        let post_box = event.target.closest('.post-box');
        let user_img = event.target.closest(".profile_img");
        let user_info = event.target.closest(".user-info");
        let body_post = event.target.closest('.body-post');
        let chat_box = event.target.closest('.chat-box');
        let comment_btn = event.target.closest('.comment-btn');

        if(body_post){
            commentsPage(body_post.dataset.comment)
        }else if(chat_box){
            commentsPage(chat_box.dataset.comment)
        }

        if(comment_btn){
            postReply(comment_btn.dataset.commentid)
        }
        if(user_img){
            goToProfilePage(user_img)
        }
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
            imgDetails(imgBody)
        }

    });

    posts_container.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.target.click();
        }
    });
        }


    
    
    let editIsLoading = false;
    // encodeURIComponent(JSON.stringify())
    function editPost(postObj){
        let post = JSON.parse(decodeURIComponent(postObj));
        let idInput = document.getElementById("post-id-input");
        idInput.value = post.id ;
        let header = document.getElementById("post-modal-title");
        let title = document.getElementById("title-input");
        let body = document.getElementById("body-input");
        document.getElementById('send-post').textContent = 'Edit';
        header.textContent = 'Edit The post'
        title.value = post.title || "" ;
        body.value = post.body || "" ;
        console.log(post.author.id == JSON.parse(localStorage.getItem("user")).id) ;
        let post_modal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
        post_modal.show()
        
        console.log(post)
    }

    function getPostId(del_id){
        document.getElementById('delete-post-id').value = del_id;
    }
    // Delete Function Start
    function deletePost(){
        const token = localStorage.getItem("token");
        let post_id = document.getElementById('delete-post-id').value
        const headers = {
            "authorization": `Bearer ${token}`
        };
        let deleteUrl = `${url}posts/${post_id}`
        axios.delete(deleteUrl , { headers: headers })
        .then((response) => {
            showAlert("Your Post Has just deleted");
            getPosts(true);
            updateUserStatus(JSON.parse(localStorage.getItem('user')))
        })
        .catch(error => {
            showAlert(error.message,"danger");
        })
        .finally(() => {
            let post_modal = new bootstrap.Modal(document.getElementById("deleteModal"), {});
            post_modal.hide()
        })
    }
    // Delete Function End


    function goToProfilePage(clickableElement) { 
        if(clickableElement.dataset.userinfo){
            window.location = `profile.html?userId=${clickableElement.dataset.userinfo}`
        }
        playSound();
    }
    function imgDetails(imgBody){
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

    function hoverSound() {
    let sound = document.getElementById("hoverSound");
    sound.play();
  }
  function playSound() {
    let sound = document.getElementById("clickSound");
    sound.play();
  }
    AOS.init({
    duration: 1000,
    once: true,
    easing: 'ease-in-out',
  });