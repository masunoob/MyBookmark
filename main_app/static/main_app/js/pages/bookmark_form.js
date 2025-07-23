class BookmarkForm {
  constructor() {
    this.backButton;
    this.cancelButton;
    this.form;
    this.tagsInput;
    this.tagInput;
    this.tagsDisplay;
    this.tagsHiddenField;
    this.tags = [];
    this.tagColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#FFB4B4', '#C7CEEA', '#B8E6B8', '#FFD93D'
    ];

    this.init();
  }

  init() {
    // 戻るボタン
    this.backButton = document.querySelector('.backButton');
    if (this.backButton) {
      this.backButton.addEventListener('click', this.handleBackButtonClick.bind(this));
    }

    // キャンセルボタン（history.back()を使用している場合）
    this.cancelButton = document.querySelectorAll('button[onclick="history.back()"]');
    this.cancelButton.forEach(button => {
      button.removeAttribute('onclick');
      button.addEventListener('click', this.handleCancelClick.bind(this));
    });

    // フォーム送信の処理
    this.form = document.querySelector('.bookmark-form');
    if (this.form) {
      this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    // タグUI要素
    this.tagInput = document.getElementById('tag-input');
    this.tagsDisplay = document.getElementById('tags-display');
    this.tagsHiddenField = document.querySelector('input[name="tags"]');
    
    if (this.tagInput && this.tagsDisplay && this.tagsHiddenField) {
      this.initializeTags();
      this.setupTagInput();
    }
  }

  // 戻るボタンのクリック処理
  handleBackButtonClick(event) {
    event.preventDefault();
    NavigationService.navigateFromDataUrl(event.currentTarget);
  }

  // キャンセルボタンのクリック処理
  handleCancelClick(event) {
    event.preventDefault();
    NavigationService.goBack('/bookmarks/');
  }

  // フォーム送信処理
  handleFormSubmit(event) {
    // バリデーションが必要な場合はここで実行
    const isValid = this.validateForm(event.target);
    
    if (!isValid) {
      event.preventDefault();
      return;
    }

    // 成功時のリダイレクトは通常Django側で処理
    // 必要に応じてここでカスタム処理を追加
  }

  // タグの初期化（編集時に既存タグを表示）
  initializeTags() {
    // 隠しフィールドから既存のタグ名を取得（フォームの初期値）
    const existingTagNames = this.tagsHiddenField.value;
    
    if (existingTagNames && existingTagNames.length > 0) {
      const tagNames = existingTagNames.split(',').map(name => name.trim()).filter(name => name);
      
      // tagsリストを初期化
      this.tags = [...tagNames];
      
      // 表示用に追加
      tagNames.forEach(tagName => {
        this.addTagToDisplay(tagName);
      });
    }
  }

  // タグ入力の設定
  setupTagInput() {
    this.tagInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.addTag();
      }
    });

    this.tagInput.addEventListener('blur', () => {
      this.addTag();
    });
  }

  // タグを追加
  addTag() {
    const tagName = this.tagInput.value.trim();
    if (tagName && !this.tags.includes(tagName)) {
      this.tags.push(tagName);
      this.addTagToDisplay(tagName);
      this.updateHiddenField();
      this.tagInput.value = '';
    }
  }

  // タグの表示を追加
  addTagToDisplay(tagName) {
    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.style.backgroundColor = this.getTagColor(tagName);
    
    tagElement.innerHTML = `
      ${tagName}
      <button type="button" class="tag-remove" data-tag="${tagName}">×</button>
    `;
    
    const removeButton = tagElement.querySelector('.tag-remove');
    removeButton.addEventListener('click', () => this.removeTag(tagName));
    
    this.tagsDisplay.appendChild(tagElement);
  }

  // タグを削除
  removeTag(tagName) {
    this.tags = this.tags.filter(tag => tag !== tagName);
    
    // 表示からも削除
    const tagElements = this.tagsDisplay.querySelectorAll('.tag');
    tagElements.forEach(element => {
      const removeButton = element.querySelector('.tag-remove');
      if (removeButton && removeButton.dataset.tag === tagName) {
        element.remove();
      }
    });
    
    this.updateHiddenField();
  }

  // 隠しフィールドを更新
  updateHiddenField() {
    this.tagsHiddenField.value = this.tags.join(',');
  }

  // タグの色を取得（ハッシュベース）
  getTagColor(tagName) {
    if (!this.tagColors || !Array.isArray(this.tagColors)) {
      return '#4ECDC4'; // デフォルト色を返す
    }
    
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.tagColors.length;
    return this.tagColors[index];
  }

  // フォームバリデーション
  validateForm(form) {
    const titleInput = form.querySelector('input[name="title"]');
    const urlInput = form.querySelector('input[name="url"]');

    // タイトルの必須チェック
    if (!titleInput.value.trim()) {
      this.showError(titleInput, 'タイトルは必須です');
      return false;
    }

    // URLの形式チェック
    if (!urlInput.value.trim()) {
      this.showError(urlInput, 'URLは必須です');
      return false;
    }

    if (!NavigationService.isValidUrl(urlInput.value)) {
      this.showError(urlInput, '正しいURL形式で入力してください');
      return false;
    }

    return true;
  }

  // エラーメッセージの表示
  showError(input, message) {
    // 既存のエラーメッセージを削除
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // エラークラスを追加
    input.classList.add('error');

    // エラーメッセージを追加
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    const errorsContainer = input.parentElement.querySelector('.form-errors') || 
                           input.parentElement;
    errorsContainer.appendChild(errorElement);

    // フォーカスを当てる
    input.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BookmarkForm();
}); 