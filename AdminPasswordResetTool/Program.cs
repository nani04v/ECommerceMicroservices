Console.Write("Enter your new admin password: ");
string password = Console.ReadLine()!;

if (string.IsNullOrWhiteSpace(password))
{
    Console.WriteLine("Password cannot be empty.");
    return;
}

string hash = BCrypt.Net.BCrypt.HashPassword(password);

Console.WriteLine("\nGenerated BCrypt hash:");
Console.WriteLine(hash);