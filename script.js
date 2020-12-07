const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal , focus on Input
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Even Listeners
modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click',(e) => (e.target===modal) ? modal.classList.remove('show-modal') : false );

// Validate Form
function validate(nameValue,urlValue){

    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if(!nameValue || !urlValue){
        alert('Please Submit value for both fields');
        return false;
    }   

    if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }

    // Valid
    return true;
}

// Building Bookmarks
function buildBookmarks(){
    // Remove all bookmark elements
    bookmarksContainer.textContent='';
    // Build Items
    bookmarks.forEach((bookmark)=> {
        const {name , url} = bookmark;
        
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title','Delete Bookmark');
        closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`);

        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        const favicon = document.createElement('img');
        favicon.setAttribute('src',`https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt','Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target','_blank');
        link.textContent = name;
        
        // Append to bookmarks container
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch Bookmarks
function fetchBookmarks(){
    // Get Bookmarks from local storage if available
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        // Create Bookmarks array in local storage
        bookmarks = [
            {
                name: 'Google',
                url: 'https://google.com',
            },
        ];
        
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }

    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url){
    bookmarks.forEach((bookmark,i)=>{
        
        if(bookmark.url === url){
            bookmarks.splice(i,1);
        }
    });
    // Update Bookmarks array in Local Storage, Re-Populate DOM
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle Data from form
function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

    if(!urlValue.includes('http://') && !urlValue.includes('https://')){
        urlValue = `https://${urlValue}`;
    }

    if(!validate(nameValue,urlValue)){
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();

}

// Event Listener
bookmarkForm.addEventListener('submit',storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();