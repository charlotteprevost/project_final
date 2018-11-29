from django import forms

class FindEvent(forms.Form):
    artist = forms.CharField(label='Find artist', max_length=100)