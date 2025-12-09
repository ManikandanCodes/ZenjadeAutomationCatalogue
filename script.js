document.addEventListener("DOMContentLoaded", () => {

    const mobileToggle = document.querySelector(".mobile-nav-toggle");
    const mainNav = document.getElementById("main-nav");

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            mainNav.classList.toggle("open");
            const expanded = mainNav.classList.contains("open");
            mobileToggle.setAttribute("aria-expanded", String(expanded));
        });

        mainNav.querySelectorAll(".has-dropdown > a").forEach((link) => {
            link.addEventListener("click", (e) => {
                if (window.innerWidth > 900) return;

                e.preventDefault();

                const parent = e.currentTarget.closest(".has-dropdown");
                if (!parent) return;

                if (parent.classList.contains("open")) {
                    parent.classList.remove("open");
                } else {
                    mainNav.querySelectorAll(".has-dropdown.open").forEach((el) => {
                        el.classList.remove("open");
                    });
                    parent.classList.add("open");
                }
            });
        });

        document.addEventListener("click", (e) => {
            if (window.innerWidth > 900) return;

            if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                mainNav.classList.remove("open");
                mobileToggle.setAttribute("aria-expanded", "false");
            }

            mainNav.querySelectorAll(".has-dropdown.open").forEach((el) => {
                const dropdown = el.querySelector(".dropdown");
                if (dropdown && !dropdown.contains(e.target) && !el.contains(e.target)) {
                    el.classList.remove("open");
                }
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                mainNav.classList.remove("open");
                mobileToggle.setAttribute("aria-expanded", "false");
                mainNav.querySelectorAll(".has-dropdown.open").forEach((el) => {
                    el.classList.remove("open");
                });
            }
        });
    }


    const componentsContainer = document.getElementById("componentsContainer");
    const navCartBtn = document.getElementById("navCartBtn");
    const navbarCartBadge = document.getElementById("navbarCartBadge");


    let cart = [];
    try {
        const stored = localStorage.getItem("zenjade_cart");
        if (stored) {
            cart = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load cart", e);
    }


    const detailsModal = document.getElementById("detailsModal");
    const cartModal = document.getElementById("cartModal");
    const closeModalBtns = document.querySelectorAll(".modal .close");

    const modalImage = document.getElementById("modalImage");
    const modalName = document.getElementById("modalName");
    const modalDesc = document.getElementById("modalDesc");
    const modalAddCartBtn = document.getElementById("modalAddCart");

    const enquiryItemsBody = document.getElementById("enquiryItems");
    const totalQtyDisplay = document.getElementById("totalQtyDisplay");
    const previewBtnModal = document.getElementById("previewBtnModal");


    updateBadge();


    if (componentsContainer) {
        componentsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("view-details-btn")) {
                const card = e.target.closest(".component-card");
                openDetailsModal(card);
            }
            if (e.target.classList.contains("add-cart-btn")) {
                const card = e.target.closest(".component-card");
                addToCart(card.dataset.id, card.dataset.name);
                showToast("Added to Enquiry!");
            }
        });
    }


    if (modalAddCartBtn) {
        modalAddCartBtn.addEventListener("click", () => {
            const id = modalAddCartBtn.dataset.id;
            const name = modalAddCartBtn.dataset.name;
            if (id && name) {
                addToCart(id, name);
                if (detailsModal) detailsModal.classList.remove("active");
                showToast("Added to Enquiry!");
            }
        });
    }


    if (navCartBtn) {
        navCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            renderCart();
            if (cartModal) {
                cartModal.classList.add("active");
                cartModal.setAttribute("aria-hidden", "false");
            }
        });
    }


    closeModalBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (detailsModal) detailsModal.classList.remove("active");
            if (cartModal) cartModal.classList.remove("active");
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === detailsModal) detailsModal.classList.remove("active");
        if (e.target === cartModal) cartModal.classList.remove("active");
    });



    if (cartModal) {
        let contentDiv = cartModal.querySelector('.modal-content');
        if (contentDiv && !document.getElementById("checkoutSuccessMsg")) {
            const successDiv = document.createElement('div');
            successDiv.id = "checkoutSuccessMsg";
            successDiv.className = "cart-success-view";
            successDiv.innerHTML = `
                <i class="fa fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>Your enquiry has been submitted successfully.<br>We will contact you shortly.</p>
                <button id="successCloseBtn">Continue Browsing</button>
             `;
            contentDiv.appendChild(successDiv);


            const successCloseBtn = document.getElementById('successCloseBtn');
            if (successCloseBtn) {
                successCloseBtn.addEventListener('click', () => {
                    cartModal.classList.remove('active');
                    setTimeout(() => toggleCartView(true), 300);
                });
            }
        }
    }

    function toggleCartView(showCart) {
        const successDiv = document.getElementById("checkoutSuccessMsg");
        const title = document.getElementById("cartTitle");
        const items = document.querySelector("#cartModal .items");
        const total = document.querySelector("#cartModal .total-qty-box") || (document.getElementById("totalQtyDisplay") ? document.getElementById("totalQtyDisplay").parentNode : null);
        const footer = document.querySelector("#cartModal .enquiry-footer") || (document.getElementById("previewBtnModal") ? document.getElementById("previewBtnModal").parentNode : null);

        if (showCart) {
            if (successDiv) successDiv.style.display = "none";
            if (title) title.style.display = "block";
            if (items) items.style.display = "block";
            if (total) total.style.display = "block";
            if (footer) footer.style.display = "flex";
        } else {
            if (successDiv) successDiv.style.display = "flex";
            if (title) title.style.display = "none";
            if (items) items.style.display = "none";
            if (total) total.style.display = "none";
            if (footer) footer.style.display = "none";
        }
    }

    if (previewBtnModal) {
        previewBtnModal.textContent = "Checkout";


        const newBtn = previewBtnModal.cloneNode(true);
        previewBtnModal.parentNode.replaceChild(newBtn, previewBtnModal);

        newBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                showToast("Your cart is empty!");
                return;
            }


            cart = [];
            saveCart();
            renderCart();


            toggleCartView(false);
        });
    }


    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    if (searchInput || categoryFilter) {
        const filterProducts = () => {
            const term = searchInput ? searchInput.value.toLowerCase().trim() : "";
            const cat = categoryFilter ? categoryFilter.value : "all";

            const cards = document.querySelectorAll(".component-card");

            cards.forEach(card => {
                const name = (card.dataset.name || "").toLowerCase();
                const type = (card.dataset.type || "").toLowerCase();

                const matchesSearch = name.includes(term);
                const matchesCategory = (cat === "all") || (type === cat);

                if (matchesSearch && matchesCategory) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        };

        if (searchInput) searchInput.addEventListener("input", filterProducts);
        if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
    }



    function saveCart() {
        localStorage.setItem("zenjade_cart", JSON.stringify(cart));
        updateBadge();
    }

    function openDetailsModal(card) {
        if (!detailsModal) return;
        const id = card.dataset.id;
        const name = card.dataset.name;
        const img = card.dataset.img;
        const desc = card.dataset.desc;

        if (modalName) modalName.textContent = name;
        if (modalImage) modalImage.src = img;
        if (modalDesc) modalDesc.textContent = desc;

        if (modalAddCartBtn) {
            modalAddCartBtn.dataset.id = id;
            modalAddCartBtn.dataset.name = name;
        }

        detailsModal.classList.add("active");
        detailsModal.setAttribute("aria-hidden", "false");
    }

    function addToCart(id, name) {
        const existing = cart.find((item) => item.id === id);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ id, name, qty: 1 });
        }
        saveCart();
    }

    function updateBadge() {
        const total = cart.reduce((acc, item) => acc + item.qty, 0);
        if (navbarCartBadge) {
            navbarCartBadge.textContent = total;
            if (total > 0) {
                navbarCartBadge.style.display = "inline-block";
            } else {
                navbarCartBadge.style.display = "none";
            }
        }
        if (totalQtyDisplay) totalQtyDisplay.textContent = total;
    }

    function renderCart() {
        if (!enquiryItemsBody) return;
        enquiryItemsBody.innerHTML = "";
        updateBadge();

        if (cart.length === 0) {
            enquiryItemsBody.innerHTML =
                '<tr><td colspan="3" style="padding:12px; text-align:center;">No items in enquiry list.</td></tr>';
            return;
        }

        cart.forEach((item, index) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
        <td style="padding:8px; border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">
            <div style="display:flex; align-items:center; gap:8px;">
                <button class="qty-btn" data-idx="${index}" data-action="dec" style="width:24px; height:24px; cursor:pointer;">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" data-idx="${index}" data-action="inc" style="width:24px; height:24px; cursor:pointer;">+</button>
                <button class="qty-btn" data-idx="${index}" data-action="del" style="margin-left:8px; color:red; background:none; border:none; cursor:pointer;"><i class="fa fa-trash"></i></button>
            </div>
        </td>
      `;
            enquiryItemsBody.appendChild(tr);
        });

        const buttons = enquiryItemsBody.querySelectorAll(".qty-btn");
        buttons.forEach((btn) => {
            btn.addEventListener("click", handleCartAction);
        });
    }

    function handleCartAction(e) {
        const idx = parseInt(e.currentTarget.dataset.idx);
        const action = e.currentTarget.dataset.action;

        if (action === "inc") {
            cart[idx].qty++;
        } else if (action === "dec") {
            if (cart[idx].qty > 1) {
                cart[idx].qty--;
            } else {
                cart.splice(idx, 1);
            }
        } else if (action === "del") {
            cart.splice(idx, 1);
        }
        saveCart();
        renderCart();
    }

    function showToast(msg) {
        const toast = document.createElement("div");
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "20px",
            zIndex: "9999",
            fontSize: "14px",
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
});
