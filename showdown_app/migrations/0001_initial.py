# Generated by Django 2.1.3 on 2018-12-04 15:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.IntegerField()),
                ('venue', models.CharField(max_length=264)),
                ('display_name', models.CharField(max_length=264)),
                ('city', models.CharField(max_length=128)),
                ('date', models.DateField()),
                ('uri', models.CharField(max_length=264)),
                ('going', models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='ShowDownUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spotify_display_name', models.CharField(max_length=128)),
                ('spotify_id', models.CharField(max_length=128)),
                ('spotify_image', models.CharField(max_length=264)),
            ],
        ),
        migrations.AddField(
            model_name='event',
            name='created_by',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='events', to='showdown_app.ShowDownUser'),
        ),
    ]
