/**
 * ナビゲーション関連の処理を管理するサービス
 */
class NavigationService {
  
  /**
   * 指定されたURLに遷移
   * @param {string} url - 遷移先URL
   * @param {Object} options - オプション設定
   */
  static navigateTo(url, options = {}) {
    const defaultOptions = {
      newTab: false,
      replace: false,
      confirm: false,
      confirmMessage: '移動しますか？'
    };
    
    const config = { ...defaultOptions, ...options };
    
    if (!url) {
      console.warn('NavigationService: URLが指定されていません');
      return;
    }
    
    // 確認ダイアログが必要な場合
    if (config.confirm && !confirm(config.confirmMessage)) {
      return;
    }
    
    try {
      if (config.newTab) {
        // 新しいタブで開く
        window.open(url, '_blank', 'noopener,noreferrer');
      } else if (config.replace) {
        // 履歴を置き換えて遷移
        window.location.replace(url);
      } else {
        // 通常の遷移
        window.location.href = url;
      }
    } catch (error) {
      console.error('NavigationService: 遷移に失敗しました', error);
    }
  }
  
  /**
   * 外部リンクを新しいタブで開く
   * @param {string} url - 外部URL
   */
  static openExternal(url) {
    this.navigateTo(url, { newTab: true });
  }
  
  /**
   * 戻る操作
   * @param {string} fallbackUrl - 履歴がない場合のフォールバックURL
   */
  static goBack(fallbackUrl = '/') {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigateTo(fallbackUrl);
    }
  }
  
  /**
   * ページリロード
   * @param {boolean} forceReload - キャッシュを無視してリロード
   */
  static reload(forceReload = false) {
    window.location.reload(forceReload);
  }
  
  /**
   * データ属性からURLを取得してナビゲーション
   * @param {HTMLElement} element - data-url属性を持つ要素
   * @param {Object} options - ナビゲーションオプション
   */
  static navigateFromDataUrl(element, options = {}) {
    const url = element.dataset.url;
    if (url) {
      this.navigateTo(url, options);
    } else {
      console.warn('NavigationService: data-url属性が見つかりません', element);
    }
  }
  
  /**
   * フォーム送信後のリダイレクト
   * @param {string} url - リダイレクト先URL
   * @param {number} delay - 遅延時間（ミリ秒）
   */
  static redirectAfterDelay(url, delay = 1000) {
    setTimeout(() => {
      this.navigateTo(url);
    }, delay);
  }
  
  /**
   * URLが有効かチェック
   * @param {string} url - チェックするURL
   * @return {boolean} 有効かどうか
   */
  static isValidUrl(url) {
    try {
      new URL(url, window.location.origin);
      return true;
    } catch {
      return false;
    }
  }
}

// グローバルに公開
window.NavigationService = NavigationService; 