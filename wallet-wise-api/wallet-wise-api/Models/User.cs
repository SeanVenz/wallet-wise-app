﻿using Google.Cloud.Firestore;

[FirestoreData]
public class User
{
    [FirestoreProperty]
    public string? Id { get; set; }
    [FirestoreProperty]
    public string? Email { get; set; }
    [FirestoreProperty]
    public string? Password { get; set; }
    [FirestoreProperty]
    public string FullName { get; set; }
    [FirestoreProperty]
    public string IDNumber { get; set; }
    [FirestoreProperty]
    public string? PhoneNumber{ get; set; }
    [FirestoreProperty]
    public string? Role { get; set; }
}
