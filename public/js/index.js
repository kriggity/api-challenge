// Define Vars
const appId = 'a1281642';
const appKey = 'b9bb518eca13a361ecbd6af8cc03cba4';
const appStr = `&app_id=${appId}&app_key=${appKey}`;
const baseURL = `https://api.edamam.com/search?q=`;
let maxPages;
let currentPage = 1;
let fromInt = 0;
let toInt = 12;

const searchForm = document.querySelector('#search form');
const searchInput = document.getElementById('searchQuery');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');
const pagesDiv = document.getElementById('pages');
const pageNumCurr = document.querySelector('#pagination .pageNumCurr');
const pageNumMax = document.querySelector('#pagination .pageNumMax');
const searchResultsDiv = document.getElementById('searchResults');
const template = document.getElementsByTagName('template');
const recipeItem = document.querySelectorAll('.recipeItem');

// init listeners
searchForm.addEventListener('submit', fetchResults);
searchForm.addEventListener('submit', clearForm);
searchForm.addEventListener('reset', clearForm);
btnPrev.addEventListener('click', pagePrev);
btnNext.addEventListener('click', pageNext);


// console.log(baseURL);
async function getRecipesAsync(str, from, to) {
    let url = baseURL + str + appStr; // build the string; format str for URL
    if (from !== '' && to !== '') { // from and to are for individual results, not pages
        url += `&from=${from}&to=${to}`;
    }
    // console.log(url);
    // let response = await fetch(url);
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function pageNext(e) {
    fromInt += 12;
    toInt += 12;
    currentPage++;
    pageMe();
    fetchResults(e);
    // console.log(`pageNext(): fromInt:${fromInt}, toInt:${toInt}, currentPage:${currentPage}`);
}
function pagePrev(e) {
    if (fromInt !== 0) {
        fromInt -= 12;
        toInt -= 12;
        currentPage--;
        pageMe();
        fetchResults(e);
        // console.log(`pagePrev(): fromInt:${fromInt}, toInt:${toInt}, currentPage:${currentPage}`);
    }
}
function clearForm() {
    currentPage = 1;
}
function pageMe() {
    pageNumCurr.innerText = currentPage
    pageNumMax.innerText = maxPages;

    if (currentPage === 1) {
        btnPrev.disabled = true;
    } else {
        btnPrev.disabled = false;
    }
    if (currentPage === maxPages) {
        btnNext.disabled = true;
    } else {
        btnNext.disabled = false;
    }
}

function fetchResults(e) {
    e.preventDefault();
    let searchTxt = encodeURI(searchInput.value);
    // console.log(searchTxt);
    getRecipesAsync(searchTxt, fromInt, toInt)
        .then(data => {
            $('#suggested').remove();
            $('.recipeItem').remove();
            let resultsTotal = data.count;
            maxPages = Math.ceil(resultsTotal / 12);
            pageMe();
            if (maxPages > 0 && resultsTotal > 9) {
                pagesDiv.style.display = 'flex';
            } else {
                pagesDiv.style.display = 'none';
            }
            // console.log(data);

            let recipeList = data.hits;
            // console.log(recipeList);
            for (item of recipeList) {
                // console.log(item.recipe);
                let imgSrc;
                if (imgSrc !== '') {
                    imgSrc = item.recipe.image;
                } else {
                    imgSrc = 'https://via.placeholder.com/150?text=No+Image+Available';
                }
                let label = item.recipe.label;
                let url = item.recipe.url;
                let cals = item.recipe.calories;

                let clone = template[0].content.cloneNode(true); // 0 index is essential
                let img = clone.querySelector('img');
                let a = clone.querySelector('a');
                let pTitle = clone.querySelector('p.title');
                let pCals = clone.querySelector('p.calories');

                img.src = imgSrc;
                img.alt = label;
                a.href = url;
                pTitle.innerText = label;
                pCals.innerText += cals.toFixed(0);

                searchResultsDiv.appendChild(clone);

            }
        });
}
$('#scrollTop').click(function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "fast");
    return false;
});
// $(document).ready(function () {
//     let winHeight = $(window).height();
//     let headHeight = $('header').height();
//     let footHeight = $('footer').height();
//     let mainHeight = winHeight - headHeight - footHeight;
//     $('main').css('height', `${mainHeight}px`);
// });
// $(window).resize(function () {
//     let winHeight = $(window).height();
//     let headHeight = $('header').height();
//     let footHeight = $('footer').height();
//     let mainHeight = winHeight - headHeight - footHeight;
//     $('main').css('height', `${mainHeight}px`);
// });

