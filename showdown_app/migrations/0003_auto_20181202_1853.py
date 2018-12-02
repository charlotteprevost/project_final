# Generated by Django 2.1.3 on 2018-12-02 18:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('showdown_app', '0002_auto_20181201_0059'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShowDownUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spotify_display_name', models.CharField(max_length=128)),
                ('spotify_id', models.CharField(max_length=128)),
            ],
        ),
        migrations.AddField(
            model_name='event',
            name='going',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='user_going', to='showdown_app.ShowDownUser'),
        ),
        migrations.AddField(
            model_name='event',
            name='maybe',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='user_maybe', to='showdown_app.ShowDownUser'),
        ),
    ]