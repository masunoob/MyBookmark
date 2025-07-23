from django import forms
from .models import Bookmark, Tag

class BookmarkForm(forms.ModelForm):
    # カスタムタグフィールド（文字列で受け取る）
    tags = forms.CharField(
        required=False,
        widget=forms.HiddenInput(),
        label='タグ'
    )
    
    class Meta:
        model = Bookmark
        fields = ['title', 'url', 'description']
        labels = {
            'title': 'タイトル',
            'url': 'URL', 
            'description': '説明'
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # 編集時に既存のタグ名を初期値として設定
        if self.instance and self.instance.pk:
            existing_tags = list(self.instance.tags.values_list('name', flat=True))
            self.initial['tags'] = ','.join(existing_tags)
    
    def clean_tags(self):
        """タグ名をTagオブジェクトに変換"""
        tags_string = self.cleaned_data.get('tags', '')
        
        if not tags_string:
            return []
        
        tag_names = [name.strip() for name in tags_string.split(',') if name.strip()]
        tag_objects = []
        
        for tag_name in tag_names:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            tag_objects.append(tag)
        
        return tag_objects
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        
        if commit:
            instance.save()
            # ManyToManyフィールドは保存後に設定
            instance.tags.set(self.cleaned_data['tags'])
            
        return instance