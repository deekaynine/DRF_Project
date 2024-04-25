# Generated by Django 4.0.10 on 2024-04-24 23:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Vendor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.FileField(blank=True, default='vendor.jpg', null=True, upload_to='vendor')),
                ('name', models.CharField(default='vendor_name', help_text='Shop Name', max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('mobile', models.CharField(blank=True, help_text='Shop Mobile Number', max_length=100, null=True)),
                ('active', models.BooleanField(default=False)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('slug', models.SlugField(blank=True, max_length=500, null=True, unique=True)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='vendor', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Vendors',
                'ordering': ['-date'],
            },
        ),
    ]
