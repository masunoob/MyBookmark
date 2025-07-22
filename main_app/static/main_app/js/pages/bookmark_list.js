class BookmarkList {
  constructor() {
    this.init();
    this.bookmarkList;
    this.createButton;
    this.editButton;
    this.deleteButton;
  }

  init() {
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

  // ブックマークカードのクリックイベント
  handleArticleClick(event) {
    const url = event.currentTarget.getAttribute('data-url');
    window.open(url, '_blank');
  }

  // 作成ボタンのクリックイベント
  handleCreateButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const url = event.currentTarget.getAttribute('data-url');
    window.location.href = url;
  }

  // 編集ボタンのクリックイベント
  handleEditButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const url = event.currentTarget.getAttribute('data-url');
    const id = event.currentTarget.getAttribute('data-id');
    window.location.href = `${url}?id=${id}`;
  }

  // 削除ボタンのクリックイベント
  handleDeleteButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const url = event.currentTarget.getAttribute('data-url');
    const id = event.currentTarget.getAttribute('data-id');
    window.location.href = `${url}?id=${id}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BookmarkList();
});