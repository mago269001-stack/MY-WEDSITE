document.addEventListener("DOMContentLoaded", () => {
    fetch('data/resume-data.json')
        .then(response => response.json())
        .then(data => {
            renderHeader(data.personal);
            renderSkills(data.skills);
            renderExperiences(data.experiences);
            renderPortfolios(data.portfolios);
            renderCerts(data.certs);
            initModalContainer(); 
        })
        .catch(error => console.error("資料載入失敗:", error));
});

function renderHeader(p) {
    document.getElementById("header-name").innerHTML = `${p.name} <span class="text-base sm:text-lg font-normal text-white/90">${p.enName}</span>`;
    document.getElementById("header-title").innerHTML = `希望職稱：<span class="bg-white/20 px-2.5 py-0.5 rounded text-white font-semibold">${p.title}</span>`;
    document.getElementById("header-status").innerHTML = `<i class="fa-solid fa-circle text-[#71D68D] text-[8px] mr-1.5 animate-pulse"></i>${p.status}`;
    document.getElementById("contact-phone").textContent = p.phone;
    document.getElementById("contact-email").textContent = p.email;
    document.getElementById("contact-location").textContent = p.location;
    document.getElementById("contact-education").textContent = p.education;
    document.getElementById("header-summary").textContent = p.summary;
    document.getElementById("avatar-img").src = p.avatar;
}

function renderSkills(skills) {
    const container = document.getElementById("skills-container");
    const categories = [
        { title: "視覺與設計專長", items: skills.visual, borderColor: "border-[#958FD6]", dotColor: "bg-[#958FD6]" },
        { title: "文書與軟體應用", items: skills.office, borderColor: "border-[#66BFD6]", dotColor: "bg-[#66BFD6]" },
        { title: "行政與管理實務", items: skills.admin, borderColor: "border-[#D6AD9C]", dotColor: "bg-[#D6AD9C]" }
    ];

    container.innerHTML = categories.map(cat => `
        <div class="bg-slate-50 p-5 rounded-2xl border-2 ${cat.borderColor}/40 space-y-3 shadow-2xs">
            <h3 class="font-bold text-slate-800 text-base flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full ${cat.dotColor}"></span>
                <span>${cat.title}</span>
            </h3>
            <div class="flex flex-wrap gap-2">
                ${cat.items.map(item => `
                    <span class="bg-white text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200/60 shadow-2xs">${item}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderExperiences(exps) {
    const container = document.getElementById("experience-container");
    container.innerHTML = exps.map((exp, idx) => `
        <div class="resume-card bg-slate-50 rounded-2xl p-6 border-l-4 ${exp.type === '現職' ? 'border-l-[#958FD6] border-slate-200' : 'border-l-[#D6D097] border-slate-200'} border-t border-r border-b shadow-2xs relative overflow-hidden transition hover:border-slate-300">
            <div class="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200/60 gap-2">
                <div>
                    <span class="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${exp.type === '現職' ? 'bg-[#958FD6]/15 text-[#7a72c4]' : 'bg-[#D6D097]/30 text-amber-900'} mb-1">
                        ${exp.type || '經歷'}
                    </span>
                    <h3 class="text-xl font-bold text-slate-800">${exp.company}</h3>
                    <p class="text-sm font-medium text-slate-600 mt-0.5">${exp.meta}</p>
                </div>
                <div class="flex items-center justify-between md:justify-end gap-3">
                    <span class="text-sm font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200/60 inline-block">
                        ${exp.period}
                    </span>
                    <button onclick="toggleExperience(${idx})" class="w-9 h-9 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs" title="展開/收合詳細內容">
                        <i id="exp-icon-${idx}" class="fa-solid fa-chevron-${exp.isOpen ? 'up' : 'down'} text-xs transition-transform"></i>
                    </button>
                </div>
            </div>
            
            <div id="exp-content-${idx}" class="${exp.isOpen ? '' : 'hidden'} pt-4 transition-all">
                <h4 class="text-base font-bold text-slate-800 mb-3">${exp.title}</h4>
                <ul class="space-y-2 text-slate-600 text-sm leading-relaxed">
                    ${exp.details.map(d => `<li class="flex items-start"><span class="text-[#958FD6] mr-2 font-bold">•</span><span>${d}</span></li>`).join('')}
                </ul>
                ${exp.tags && exp.tags.length > 0 ? `
                    <div class="pt-4 mt-4 border-t border-slate-200/60 flex flex-wrap gap-2">
                        ${exp.tags.map(tag => `<span class="text-xs bg-[#66BFD6]/10 text-[#3b879c] px-2.5 py-1 rounded-lg border border-[#66BFD6]/20 font-medium">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function toggleExperience(idx) {
    const content = document.getElementById(`exp-content-${idx}`);
    const icon = document.getElementById(`exp-icon-${idx}`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        content.classList.add('hidden');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

function renderPortfolios(ports) {
    const container = document.getElementById("portfolio-container");
    container.innerHTML = ports.map((p, index) => {
        let embeddedContent = '';

        if (p.type === 'video') {
            embeddedContent = `
                <div id="media-box-${index}" class="h-48 w-full bg-slate-200 relative overflow-hidden rounded-xl mb-4 flex-shrink-0">
                    <img id="thumb-${index}" src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
                    <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs z-10 border border-[#66BFD6]/30">
                        ${p.category}
                    </span>
                </div>
                <div class="space-y-2 flex-grow">
                    <h3 class="font-bold text-slate-800 text-lg">${p.title}</h3>
                    <p class="text-slate-600 text-sm leading-relaxed">${p.description}</p>
                </div>
                <div class="pt-4 mt-auto grid grid-cols-2 gap-2">
                    <button onclick="playVideoInPlace(${index}, '${p.mediaSrc}')" class="inline-flex items-center justify-center space-x-1.5 bg-[#66BFD6] hover:bg-[#54a4bb] text-white py-2.5 px-3 rounded-xl text-xs font-medium transition shadow-2xs cursor-pointer">
                        <i class="fa-solid fa-play text-xs"></i>
                        <span>播放影片</span>
                    </button>
                    <button onclick="openModal('video', '${p.mediaSrc}', '${p.title}')" class="inline-flex items-center justify-center space-x-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-medium transition cursor-pointer">
                        <i class="fa-solid fa-expand text-xs"></i>
                        <span>放大檢視</span>
                    </button>
                </div>`;
        } else if (p.type === 'pdf-video') {
            // 第六格專用複合模式：圖片預覽可點擊播放影片，下方按鈕可閱讀 PDF
            embeddedContent = `
                <div id="media-box-${index}" class="h-48 w-full bg-slate-200 relative overflow-hidden rounded-xl mb-4 flex-shrink-0">
                    <img id="thumb-${index}" src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
                    <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs z-10 border border-[#66BFD6]/30">
                        ${p.category}
                    </span>
                </div>
                <div class="space-y-2 flex-grow">
                    <h3 class="font-bold text-slate-800 text-lg">${p.title}</h3>
                    <p class="text-slate-600 text-sm leading-relaxed">${p.description}</p>
                </div>
                <div class="pt-4 mt-auto grid grid-cols-3 gap-2">
                    <button onclick="playVideoInPlace(${index}, '${p.mediaSrc}')" class="inline-flex items-center justify-center space-x-1 bg-[#66BFD6] hover:bg-[#54a4bb] text-white py-2.5 px-2 rounded-xl text-xs font-medium transition shadow-2xs cursor-pointer" title="直接在畫面上播放短影片">
                        <i class="fa-solid fa-play text-xs"></i>
                        <span>播影片</span>
                    </button>
                    <button onclick="openModal('video', '${p.mediaSrc}', '${p.title} (影片)')" class="inline-flex items-center justify-center space-x-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 px-2 rounded-xl text-xs font-medium transition cursor-pointer" title="放大觀看影片">
                        <i class="fa-solid fa-film text-xs"></i>
                        <span>大影片</span>
                    </button>
                    <button onclick="openModal('pdf', '${p.pdfSrc}', '${p.title} (PDF 企劃書)')" class="inline-flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-2 rounded-xl text-xs font-medium transition shadow-2xs cursor-pointer" title="閱讀 PDF 企劃書檔案">
                        <i class="fa-solid fa-file-pdf text-xs"></i>
                        <span>看PDF</span>
                    </button>
                </div>`;
        } else if (p.type === 'pdf') {
            embeddedContent = `
                <div class="h-48 w-full bg-slate-200 relative overflow-hidden rounded-xl mb-4 flex-shrink-0 cursor-pointer" onclick="openModal('pdf', '${p.mediaSrc}', '${p.title}')">
                    <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover hover:scale-105 transition duration-500">
                    <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs border border-[#66BFD6]/30">
                        ${p.category}
                    </span>
                </div>
                <div class="space-y-2 flex-grow">
                    <h3 class="font-bold text-slate-800 text-lg">${p.title}</h3>
                    <p class="text-slate-600 text-sm leading-relaxed">${p.description}</p>
                </div>
                <div class="pt-4 mt-auto">
                    <button onclick="openModal('pdf', '${p.mediaSrc}', '${p.title}')" class="inline-flex items-center justify-center w-full space-x-2 bg-[#66BFD6] hover:bg-[#54a4bb] text-white py-2.5 px-4 rounded-xl text-sm font-medium transition shadow-2xs cursor-pointer">
                        <i class="fa-solid fa-expand text-xs"></i>
                        <span>單檔案放大觀看 PDF (防下載)</span>
                    </button>
                </div>`;
        } else {
            embeddedContent = `
                <div class="h-48 w-full bg-slate-200 relative overflow-hidden rounded-xl mb-4 flex-shrink-0 cursor-pointer" onclick="openModal('image', '${p.image}', '${p.title}')">
                    <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover hover:scale-105 transition duration-500">
                    <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs border border-[#66BFD6]/30">
                        ${p.category}
                    </span>
                </div>
                <div class="space-y-2 flex-grow">
                    <h3 class="font-bold text-slate-800 text-lg">${p.title}</h3>
                    <p class="text-slate-600 text-sm leading-relaxed">${p.description}</p>
                </div>
                <div class="pt-4 mt-auto flex gap-2">
                    <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center space-x-1 bg-[#66BFD6] hover:bg-[#54a4bb] text-white py-2.5 px-3 rounded-xl text-xs font-medium transition shadow-2xs">
                        <span>線上網頁</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                    <button onclick="openModal('image', '${p.image}', '${p.title}')" class="inline-flex items-center justify-center bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-medium transition cursor-pointer">
                        <i class="fa-solid fa-expand"></i>
                    </button>
                </div>`;
        }

        return `
            <div class="resume-card bg-slate-50 rounded-2xl border border-slate-200/70 overflow-hidden flex flex-col justify-between p-5 h-full">
                <div class="flex flex-col h-full">${embeddedContent}</div>
            </div>
        `;
    }).join('');
}

function renderCerts(certs) {
    const colorMap = {
        lavender: "bg-[#958FD6]/10 text-[#7a72c4] border-[#958FD6]/30",
        sky: "bg-[#66BFD6]/10 text-[#3b879c] border-[#66BFD6]/30",
        brown: "bg-[#D6AD9C]/15 text-[#8f6351] border-[#D6AD9C]/30",
        sand: "bg-[#D6D097]/25 text-[#7f773c] border-[#D6D097]/40"
    };

    const container = document.getElementById("certs-container");
    container.innerHTML = certs.map(c => `
        <div class="p-5 rounded-2xl border ${colorMap[c.color] || 'bg-slate-50 text-slate-700 border-slate-200'} flex flex-col justify-between shadow-2xs">
            <span class="text-xs font-semibold uppercase tracking-wider opacity-90">${c.name}</span>
            <span class="text-lg font-bold mt-2">${c.desc}</span>
        </div>
    `).join('');
}

function playVideoInPlace(index, mediaSrc) {
    const mediaBox = document.getElementById(`media-box-${index}`);
    if (mediaBox) {
        mediaBox.innerHTML = `
            <video width="100%" height="100%" controls autoplay controlsList="nodownload" oncontextmenu="return false;" class="w-full h-full object-cover rounded-xl bg-slate-900 shadow-2xs">
                <source src="${mediaSrc}" type="video/mp4">
                您的瀏覽器不支援此影片標籤。
            </video>`;
    }
}

function initModalContainer() {
    if (!document.getElementById("custom-modal")) {
        const modalHtml = `
            <div id="custom-modal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
                <div class="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
                    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <h3 id="modal-title" class="font-bold text-slate-800 text-lg">作品放大檢視</h3>
                        <button onclick="closeModal()" class="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer">
                            <i class="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>
                    <div id="modal-content" class="flex-grow p-4 bg-slate-900 flex items-center justify-center overflow-auto"></div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
}

function openModal(type, src, title) {
    const modal = document.getElementById("custom-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");

    modalTitle.textContent = title;

    if (type === 'pdf') {
        modalContent.innerHTML = `<iframe src="${src}#toolbar=0&navpanes=0" width="100%" height="100%" class="rounded-xl w-full h-full border-0" oncontextmenu="return false;"></iframe>`;
    } else if (type === 'video') {
        modalContent.innerHTML = `<video src="${src}" controls autoplay controlsList="nodownload" oncontextmenu="return false;" class="max-w-full max-h-full object-contain rounded-xl shadow-lg"></video>`;
    } else if (type === 'image') {
        modalContent.innerHTML = `<img src="${src}" alt="${title}" oncontextmenu="return false;" class="max-w-full max-h-full object-contain rounded-xl shadow-lg select-none" />`;
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById("custom-modal");
    if (modal) {
        modal.classList.add("hidden");
        document.getElementById("modal-content").innerHTML = "";
        document.body.style.overflow = "auto";
    }
}