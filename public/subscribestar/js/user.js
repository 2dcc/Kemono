async function loadMorePosts (skip, after = () => {}) {
  const load = document.getElementById('load-more-button');
  if (load) {
    load.outerHTML = '';
  }
  const pathname = window.location.pathname.split('/');
  const marthaView = document.getElementById('martha-view');
  const userPostsData = await fetch(`/api/subscribestar/user/${pathname[3]}?skip=${skip}`);
  const userPosts = await userPostsData.json();
  await userPosts.map(async (post) => {
    let image = '';
    let imageDl = '';
    let attachmentDl = '';
    const embed = '';
    post.attachments.map(attachment => {
      attachmentDl += `
        <a 
          class="user-post-attachment-link" 
          href="${attachment.path}" 
          target="_blank"
        >
          <p>Download ${attachment.name}</p>
        </a>
      `;
    });

    if (post.post_type === 'image') {
      image = `
        <a class="fileThumb" href="${post.post_file.path}">
          <img 
            class="user-post-image" 
            data-src="${post.post_file.path}"
          >
        </a>
      `;
      imageDl = `
        <a 
          class="user-post-attachment-link" 
          href="${post.post_file.path}" 
          target="_blank"
        >
          <p>Download ${post.post_file.name}</p>
        </a>
      `;
    }

    marthaView.innerHTML += `
      <div class="user-post-view" id=${post.id}>
        ${image}
        ${embed}
        <h2>${post.title}</h2>
        ${post.content}
        ${imageDl}
        ${attachmentDl}
        <p style="color: #757575;">${post.published_at}</p>
      </div>
    `;
  });
  marthaView.innerHTML += `
    <button onClick="loadMorePosts(${skip + 25})" id="load-more-button" class="load-more-button">Load More</a>
  `;
  lazyload();
  after();
}

async function loadHeader () {
  const pathname = window.location.pathname.split('/');
  const userData = await fetch(`/proxy/subscribestar/user/${pathname[3]}`);
  const user = await userData.json();
  document.title = `${user.name} | kemono`;
  const marthaView = document.getElementById('martha-view');
  marthaView.innerHTML = `
    <div 
      class="user-header-view" 
      style="background: url('${user.background || user.avatar}'); background-size: 100% auto; background-position: center;"
    >
      <div class="user-header-avatar" style="background-image: url('${user.avatar}');"></div>
      <div class="user-header-info">
        <div class="user-header-info-top">
          <h1>${user.name}</h1>
          <a href="https://subscribestar.adult/${pathname[3]}" target="_blank" rel="noreferrer">
            <div class="user-header-info-subscribestar"></div>
          </a>
        </div>
      </div>
    </div>
  ` + marthaView.innerHTML;
}

window.onload = () => {
  loadMorePosts(0, () => loadHeader());
}