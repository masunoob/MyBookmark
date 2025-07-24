class BookmarkList {
  constructor() {
    this.init();
    this.bookmarkList;
    this.createButton;
    this.editButton;
    this.deleteButton;
    this.searchInput;
    this.bookmarkWrappers;
  }

  init() {
    // 検索入力
    this.searchInput = document.querySelector('.search-input');
    this.bookmarkWrappers = document.querySelectorAll('.bookmark-wrapper');
    this.searchResults = document.querySelector('.search-results');
    this.searchResultsText = document.querySelector('.search-results-text');
    
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
    }

    // ブックマークリスト
    this.bookmarkList = document.querySelectorAll('.bookmark-card-content');
    this.bookmarkList.forEach(bookmark => {
      bookmark.addEventListener('click', this.handleArticleClick.bind(this));
    });

    // 作成ボタン
    this.createButton = document.querySelector('.createButton');
    this.createButton.addEventListener('click', this.handleCreateButtonClick.bind(this));

    // 編集ボタン
    this.editButton = document.querySelectorAll('.editButton');
    this.editButton.forEach(button => {
      button.addEventListener('click', this.handleEditButtonClick.bind(this));
    });

    // 削除ボタン
    this.deleteButton = document.querySelectorAll('.deleteButton');
    this.deleteButton.forEach(button => {
      button.addEventListener('click', this.handleDeleteButtonClick.bind(this));
    });
  }

  // 検索入力のイベント
  handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    this.filterBookmarks(searchTerm);
  }

  filterBookmarks(searchTerm) {
    let visibleCount = 0;
    const totalCount = this.bookmarkWrappers.length;

    this.bookmarkWrappers.forEach(wrapper => {
      if (searchTerm === '') {
        // 検索語が空の場合は全て表示
        wrapper.style.display = '';
        visibleCount++;
        return;
      }

      // ブックマークの情報を取得
      const title = wrapper.querySelector('.bookmarkTitle')?.textContent.toLowerCase() || '';
      const description = wrapper.querySelector('.bookmarkDescription')?.textContent.toLowerCase() || '';
      const tags = Array.from(wrapper.querySelectorAll('.bookmark-tag'))
                      .map(tag => tag.textContent.toLowerCase())
                      .join(' ');

      // タイトル、説明、タグのいずれかに検索語が含まれているかチェック
      const isMatch = title.includes(searchTerm) || 
                     description.includes(searchTerm) || 
                     tags.includes(searchTerm);

      // 表示/非表示を切り替え
      if (isMatch) {
        wrapper.style.display = '';
        visibleCount++;
      } else {
        wrapper.style.display = 'none';
      }
    });

    // 検索結果の表示を更新
    this.updateSearchResults(searchTerm, visibleCount, totalCount);
  }

  // 検索結果の表示を更新
  updateSearchResults(searchTerm, visibleCount, totalCount) {
    if (searchTerm === '') {
      // 検索していない時は非表示
      this.searchResults.classList.add('hidden');
    } else {
      // 検索中は結果を表示
      this.searchResults.classList.remove('hidden');
      if (visibleCount === 0) {
        this.searchResultsText.textContent = `「${searchTerm}」に該当するブックマークが見つかりませんでした`;
      } else {
        this.searchResultsText.textContent = `「${searchTerm}」の検索結果: ${visibleCount}件 / 全${totalCount}件`;
      }
    }
  }

  // ブックマークカードのクリックイベント
  handleArticleClick(event) {
    NavigationService.navigateFromDataUrl(event.currentTarget, { newTab: true });
  }

  // 作成ボタンのクリックイベント
  handleCreateButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    NavigationService.navigateFromDataUrl(event.currentTarget);
  }

  // 編集ボタンのクリックイベント
  handleEditButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    NavigationService.navigateFromDataUrl(event.currentTarget);
  }

  // 削除ボタンのクリックイベント
  handleDeleteButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    NavigationService.navigateFromDataUrl(event.currentTarget);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BookmarkList();
});