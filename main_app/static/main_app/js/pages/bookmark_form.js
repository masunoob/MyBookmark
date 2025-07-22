class BookmarkForm {
  constructor() {
    this.init();
    this.backButton;
    this.cancelButton;
    this.form;
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