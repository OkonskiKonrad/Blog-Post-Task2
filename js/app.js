fetch("/json/data.json")
  .then((response) => response.json())
  .then((data) => {
    const blogPostContainer = document.getElementById("blogPostContainer");
    const categoryFilter = document.getElementById("categoryFilter");
    // add function to display blog posts
    const displayBlogPosts = () => {
      blogPostContainer.innerHTML = "";
      data.forEach((blogPost) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h2>${blogPost.title}</h2>
          <p class="postCategory">${blogPost.category}</p>
          <p>${blogPost.content}</p>
          <p>${blogPost.date}</p>
        `;
        blogPostContainer.appendChild(card);
      });
    };
    sortBlogPosts(false);
    displayBlogPosts();

    const categories = [...new Set(data.map((post) => post.category))];
    // map unique category options
    const categoryOptions = () => {
      return categories
        .map(
          (category) => `
        <div class="option">${category}</div>
      `
        )
        .join("");
    };
    // add dropdown options
    const dropdownCategories = document.createElement("div");
    dropdownCategories.className = "dropdown";
    dropdownCategories.innerHTML = `
      <div class="dropdown-toggle">All Categories</div>
      <div class="dropdown-options">
         <div class="option">All Categories</div>
         ${categoryOptions()}
      </div>
     `;
    categoryFilter.appendChild(dropdownCategories);

    // add function to filter by date
    function filterDate(post, startDate, endDate) {
      const postDate = new Date(post.date);
      return startDate <= postDate && postDate <= endDate;
    }
    // add sort buttons
    const sortButtons = document.createElement("div");
    sortButtons.innerHTML = `
        <button class="sortAsc" id="sortAsc">Sort by Date (Ascending)</button>
        <button class="sortDesc" id="sortDesc">Sort by Date (Descending)</button>
         `;
    blogPostContainer.parentNode.insertBefore(sortButtons, blogPostContainer);
    // add event listeners to sort buttons
    const sortAscButton = document.getElementById("sortAsc");
    const sortDescButton = document.getElementById("sortDesc");
    sortAscButton.addEventListener("click", () => sortBlogPosts(true));
    sortDescButton.addEventListener("click", () => sortBlogPosts(false));
    // sort blog posts by date
    function sortBlogPosts(ascending) {
      data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (ascending) {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
      displayBlogPosts(data);
    }
    // add data range container
    const dateRangeContainer = document.querySelector("#date-range-container");
    const dateRangeForm = document.createElement("form");
    dateRangeForm.innerHTML = `
        <label for="start-date" class="startDate">Start Date:</label>
        <input type="date" id="start-date" name="start-date" class="startDateInput">
        <label for="end-date">End Date:</label>
        <input type="date" id="end-date" name="end-date" class="endDateInput">
        
        `;
    dateRangeContainer.appendChild(dateRangeForm);
    // add data range function
    function displayFilteredBlogPosts() {
      const startDate = new Date(dateRangeForm.elements["start-date"].value);
      const endDate = new Date(dateRangeForm.elements["end-date"].value);
      const filteredPosts = data.filter((post) =>
        filterDate(post, startDate, endDate)
      );
      blogPostContainer.innerHTML = "";
      filteredPosts.forEach((blogPost) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <h2>${blogPost.title}</h2>
      <p class="postCategory">${blogPost.category}</p>
       <p>${blogPost.content}</p>
      <p>${blogPost.date}</p>
    `;
        blogPostContainer.appendChild(card);
      });
    }
    // add event listeners to data range form
    const startDateInput = dateRangeForm.querySelector("#start-date");
    const endDateInput = dateRangeForm.querySelector("#end-date");
    startDateInput.addEventListener("change", () => displayFilteredBlogPosts());
    endDateInput.addEventListener("change", () => displayFilteredBlogPosts());

    // add event listener to category filter dropdown
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownOptions = document.querySelector(".dropdown-options");
    const categoryOptionElements = document.querySelectorAll(".option");
    // add event listener to toggle dropdown options
    dropdownToggle.addEventListener("click", () => {
      dropdownOptions.classList.toggle("show");
    });
    // add event listener to each category option
    categoryOptionElements.forEach((option) => {
      option.addEventListener("click", () => {
        dropdownToggle.textContent = option.textContent;
        dropdownOptions.classList.remove("show");
        if (option.textContent === "All Categories") {
          displayBlogPosts(data);
        } else {
          blogPostContainer.innerHTML = "";
          const filteredPosts = data.filter(
            (post) => post.category === option.textContent
          );
          filteredPosts.forEach((blogPost) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
          <h2>${blogPost.title}</h2>
          <p class="postCategory">${blogPost.category}</p>
          <p>${blogPost.content}</p>
          <p>${blogPost.date}</p>
        `;
            blogPostContainer.appendChild(card);
          });
        }
      });
    });
  });
