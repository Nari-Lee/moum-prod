// 공통


function openOverlay() {
  fadeIn(document.getElementsByClassName("overlay")[0]);
}

function closePopup() {
  fadeOut(document.getElementsByClassName("overlay")[0]);
  for (i = 0; i < document.getElementsByClassName("layer").length; i++) {
    document.getElementsByClassName("layer")[i].innerHTML = "";
    fadeOut(document.getElementsByClassName("layer")[i]);
  }
}

// fadeIn, fadeOut 사용 시 style에 아래 속성 주셔야 부드럽게 적용됩니다.
// opacity: 1 또는 0;
// transition: opacity 0.5s ease;

function fadeIn(element) {
  element.style.display = "block";
  setTimeout(function () {
    element.style.opacity = 1;
  }, 10);
}

function fadeOut(element) {
  element.style.opacity = 0;
  setTimeout(function () {
    element.style.display = "none";
  }, 500);
}

function formatNumber(element) {
    // 현재 입력된 값에서 숫자 외의 문자를 제거
    let value = element.value.replace(/[^0-9]/g, '');

    // 숫자에 천 단위로 쉼표 추가
    element.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 로그인

var modal = document.getElementById("loginModal");
var btn = document.getElementById("openModalBtn");

// 페이지 로드 시 실행되는 함수
document.addEventListener('DOMContentLoaded', function() {
    // 회원가입 성공 후 로그인 모달 열기
    const urlParams = new URLSearchParams(window.location.search);
    const openLoginModal = urlParams.get('openLoginModal');
    if (openLoginModal === 'true') {
        openLoginModal();
    }
});

// 로그인 모달 열기 및 form.html 로드
function openLoginModal() {
    var modal = document.getElementById("loginModal");
    fetch('/auth/form')
        .then(response => response.text())
        .then(data => {
            document.getElementById('loginFormContainer').innerHTML = data;
            modal.style.display = "block";
        });
}

// 회원가입 모달 열기 및 signup.html 로드
function openSignupModal() {
    var modal = document.getElementById("signupModal");
    fetch('/user/signup')
        .then(response => response.text())
        .then(data => {
            document.getElementById('signupFormContainer').innerHTML = data;
            modal.style.display = "block";
        });
}

// 로그인 모달 닫기
function closeLoginModal() {
    var modal = document.getElementById("loginModal");
    modal.style.display = "none";
}

// 회원가입 모달 닫기
function closeSignupModal() {
    var modal = document.getElementById("signupModal");
    modal.style.display = "none";
}

// 모달 외부 클릭 시 모달 닫기 처리
window.onclick = function(event) {
    var loginModal = document.getElementById("loginModal");
    var signupModal = document.getElementById("signupModal");
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
}
// 이메일을 쿠키에 저장하는 함수
function setEmailCookie(email, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = 'savedEmail=' + encodeURIComponent(email) + '; expires=' + expires + '; path=/';
}

// 저장된 쿠키에서 이메일을 가져오는 함수
function getEmailCookie() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('savedEmail='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
}

// 로그인 폼 제출 시 이메일 저장 처리
function handleLoginSubmit() {
    const email = document.getElementById('email').value;
    const saveEmail = document.getElementById('saveEmail').checked;

    // '이메일 저장'이 체크된 경우 이메일 쿠키 저장
    if (saveEmail) {
        setEmailCookie(email, 30);  // 30일 동안 쿠키 유지
    } else {
        setEmailCookie('', -1);  // 체크 해제 시 쿠키 삭제
    }
}

// 페이지 로드 시 쿠키에 저장된 이메일을 폼에 채움
function populateEmailField() {
    const savedEmail = getEmailCookie();
    if (savedEmail) {
        const emailField = document.getElementById('email');
        const saveEmailCheckbox = document.getElementById('saveEmail');

        if (emailField && saveEmailCheckbox) {
            emailField.value = savedEmail;
            saveEmailCheckbox.checked = true;
        }
    }
}

// 마이홈

  // 수집품 등록 화면 열기
function openCollectionFormPopup() {
    fetchCollectionForm();
    openOverlay();
    fadeIn(document.querySelector(".collection-form-layer"));
}

  // 수집품 조회 화면 열기
function openCollectionViewPopup(no) {
    fetchCollectionView(no);
    openOverlay();
    fadeIn(document.getElementsByClassName("collection-view-layer")[0]);
}

  // 수집품 등록 화면 내용 가져오기
function fetchCollectionForm() {
    initCollectionSlideIndex();

    fetch(`/collection/form`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            document.querySelector('.collection-form-layer').innerHTML =
                doc.querySelector('.collection-form-layer').innerHTML;

        })
        .catch(error => {
            console.error("Error fetching collection form:", error);
        });
        console.log("collectionSlideIndex: " + collectionSlideIndex);
}

  // 수집품 조회 화면 내용 가져오기
function fetchCollectionView(no) {
    initCollectionSlideIndex();

    fetch(`/collection/view?no=${no}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            document.querySelector('.collection-view-layer').innerHTML =
                doc.querySelector('.collection-view-layer').innerHTML;

            document.addEventListener("DOMContentLoaded", function() {
                showSlides(collectionSlideIndex);
            });
        })
        .catch(error => {
            console.error("Error fetching collection view:", error);
        });

        console.log("collectionSlideIndex: " + collectionSlideIndex);
}

function deleteFile(fileNo, collectionNo) {
    fetch(`/collection/deleteFile?no=${fileNo}`)
        .then(response => response.text())
        .then(response => {
            if (response == "true") {
                alert("삭제되었습니다.");
                fetchCollectionView(collectionNo)
            } else {
                alert("삭제에 실패했습니다.");
            }
        })
}

function initCollectionSlideIndex() {
    collectionSlideIndex = 0;
}

function showSlides(index) {
    const slides = document.querySelectorAll('.slide');
    if (index >= slides.length) { collectionSlideIndex = 0; }
    if (index < 0) { collectionSlideIndex = slides.length - 1; }

    slides.forEach((slide, i) => {
        slide.style.display = (i === collectionSlideIndex) ? 'block' : 'none';
    });
}

function changeSlide(n) {
    showSlides(collectionSlideIndex += n);
    console.log("collectionSlideIndex: " + collectionSlideIndex);
}

  // 소분류 데이터 가져오기
function fetchSubcategories(maincategoryNo) {
    const subcategorySelect = document.getElementById("subcategoryNo");
    subcategorySelect.innerHTML = "";

    if (maincategoryNo == 0) {
        subcategorySelect.disabled = true;
    } else if (maincategoryNo > 0) {
        subcategorySelect.disabled = false;
        fetch(`/subcategory/list?maincategoryNo=${maincategoryNo}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(subcategory => {
                        const option = document.createElement("option");
                        option.value = subcategory.no;
                        option.text = subcategory.name;
                        subcategorySelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Error fetching subcategories:", error);
                });
    }
}

function triggerFileInput() {
    document.getElementById('files').click();
}

// 선택한 이미지 미리보기
function previewImage(event) {
    const files = event.target.files;
    const empty = document.querySelector(".empty-image");
    const slider = document.querySelector(".slider");
    const slides = document.querySelector(".slides");
    const newImages = document.getElementsByClassName("new-image");
    const currentImages = document.getElementsByClassName("current-image");
    const filenames = document.getElementById("filenames");

    filenames.innerHTML = "";
    for (i = newImages.length - 1; i >= 0 ; i--) {
        newImages[i].remove();
    }

    if (files && files.length > 0) {

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = "Uploaded Image";
                img.className = "collection-image slide new-image";
                img.onclick = function() {
                    triggerFileInput();
                };
                slides.appendChild(img);
            }

            reader.readAsDataURL(files[i]);
        }

        if (empty) {
            empty.style.display = "none";
        }

        slider.style.display = "block";
        if (slides.children.length + files.length > 1) {
            document.querySelector(".prev").style.display = "block";
            document.querySelector(".next").style.display = "block";
        } else {
            document.querySelector(".prev").style.display = "none";
            document.querySelector(".next").style.display = "none";
        }

        Array.from(files).forEach(file => {
            const element = document.createElement("p");
            element.textContent = file.name;
            filenames.appendChild(element);
        });
    } else if (currentImages && currentImages.length > 0) {
        initCollectionSlideIndex();
        showSlides(collectionSlideIndex);
    } else {
        if (empty) {
            empty.style.display = "block";
        }
        slider.style.display = "none";
    }
}

function filterCategories(element) {
    const items = document.getElementsByClassName(element.value);

    if (element.checked) {
        for(i = 0; i < items.length; i++) {
            fadeIn(items[i]);
        }
    } else {
        for(i = 0; i < items.length; i++) {
            fadeOut(items[i]);
        }
    }
}

// 채팅





// 로그인



// 댓글 길이 카운팅
function countingLength(content) {
    if (content.value.length > 300) {
        alert('댓글을 300자 이하로 입력해 주세요.');
        content.value = content.value.substring(0, 300);
        content.focus();
    }
    document.getElementById('counter').innerText = content.value.length + '/300자';
}


// 댓글 저장
function saveComment(boardNo) {

    const content = document.getElementById('content');
    // isValid(content, '댓글');

    // const boardNo = [[ `${board.no}` ]];
    const params = {
        boardNo : boardNo,
        content : content.value,
        userNo : 5
    }

    const header = $("meta[name='_csrf_header']").attr('content');
    const token = $("meta[name='_csrf']").attr('content');

    $.ajax({
        url : `/Comment/board/${boardNo}/comments`,
        type : 'post',
        contentType : 'application/json; charset=utf-8',
        dataType : 'json',
        data : JSON.stringify(params),
        async : false,
        beforeSend: function(xhr){
            xhr.setRequestHeader(header, token);
        },
        success : function (response) {
            alert('저장되었습니다.');
            content.value = '';
            document.getElementById('counter').innerText = '0/300자';
            findAllComment(boardNo);
        },
        error : function (request, status, error) {
            console.log(error)
        }
    })
}

// 전체 댓글 조회
function findAllComment(boardNo) {

    // const postId = [[ ${board.no} ]];

    $.ajax({
        url : `/Comment/board/${boardNo}/comments`,
        type : 'get',
        dataType : 'json',
        async : false,
        success : function (response) {

            // 1. 조회된 데이터가 없는 경우
            if ( !response.length ) {
                document.querySelector('.cm_list').innerHTML = '<div class="cm_none"><p>등록된 댓글이 없습니다.</p></div>';
                return false;
            }

            // 2. 렌더링 할 HTML을 저장할 변수
            let commentHtml = '';

            // 3. 댓글 HTML 추가
            response.forEach(row => {
                commentHtml += `
                        <div>
                            
                            <div class="cont"><div class="txt_con">${row.content}</div></div>
                            <p class="func_btns">
                                <button type="button" class="btns"><span class="icons icon_modify">수정</span></button>
                                <button type="button" class="btns"><span class="icons icon_del">삭제</span></button>
                            </p>
                        </div>
                    `;
            })
            // <span class="writer_img"><img src="/images/default_profile.png" width="30" height="30" alt="기본 프로필 이미지"/></span>
            // <p class="writer">
            //     <em>${row.writer}</em>
            //     <span class="date">${dayjs(row.createdDate).format('YYYY-MM-DD HH:mm')}</span>
            // </p>

            // 4. class가 "cm_list"인 요소를 찾아 HTML을 렌더링
            document.querySelector('.cm_list').innerHTML = commentHtml;
        },
        error : function (request, status, error) {
            console.log(error)
        }
    })
}
