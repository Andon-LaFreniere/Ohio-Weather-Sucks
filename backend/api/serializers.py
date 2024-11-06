from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        #no one can read what the password is
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        #should be changed for the weather application...
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        
        #dont let someone change the author of the note
        extra_kwargs = {"author": {"read_only": True}}