<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
<div class="bg-white p-8 rounded shadow-md w-full max-w-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Reset Password</h2>

    @if(session('error'))
        <div class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{{ session('error') }}</div>
    @endif

    <form method="POST" action="{{ route('customer.reset-password.submit') }}">
        @csrf
        <input type="hidden" name="token" value="{{ $token }}">
        
        <label class="block text-gray-700 mb-2">Email</label>
        <input type="email" name="email" class="w-full px-4 py-2 border rounded mb-4" required>

        <label class="block text-gray-700 mb-2">New Password</label>
        <input type="password" name="password" class="w-full px-4 py-2 border rounded mb-4" required>

        <label class="block text-gray-700 mb-2">Confirm Password</label>
        <input type="password" name="password_confirmation" class="w-full px-4 py-2 border rounded mb-4" required>

        <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Reset Password</button>
    </form>
</div>
</body>
</html>
