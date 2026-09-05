import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static String serverDomain = const String.fromEnvironment(
    'SERVER_DOMAIN',
    defaultValue: 'https://ingame-backend.onrender.com',
  );

  static String get baseUrl => '$serverDomain/api';

  // 0a. Send OTP via SMS or WhatsApp
  static Future<Map<String, dynamic>?> sendOtp({
    required String phone,
    String channel = 'sms',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phone': phone,
          'channel': channel,
        }),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (_) {}
    return null;
  }

  // 0b. Verify OTP & Authenticate User
  static Future<Map<String, dynamic>?> verifyOtp({
    required String phone,
    required String otp,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phone': phone,
          'otp': otp,
        }),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (_) {}
    return null;
  }

  // 1. Get App Configuration & Online Users Count
  static Future<Map<String, dynamic>?> getAppConfig() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/config')).timeout(
        const Duration(seconds: 3),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (_) {
      // Offline fallback
    }
    return null;
  }

  // 2. Get User Profile & Balances
  static Future<Map<String, dynamic>?> getUserProfile() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/user/profile')).timeout(
        const Duration(seconds: 3),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (_) {
      // Offline fallback
    }
    return null;
  }

  // 2b. Update User Profile (Username & Avatar)
  static Future<Map<String, dynamic>?> updateUserProfile({
    String? username,
    String? avatarPath,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/user/update-profile'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': ?username,
          'avatarPath': ?avatarPath,
        }),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (_) {
      // Fallback
    }
    return null;
  }

  // 3. Get Active Games List
  static Future<List<dynamic>?> getGamesList() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/games')).timeout(
        const Duration(seconds: 3),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data'] as List<dynamic>;
      }
    } catch (_) {
      // Offline fallback
    }
    return null;
  }

  // 4. Add Cash Deposit API
  static Future<Map<String, dynamic>?> addCash({
    required double amount,
    required String paymentMethod,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/wallet/add-cash'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': amount,
          'paymentMethod': paymentMethod,
        }),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (_) {
      // Fallback
    }
    return null;
  }

  // 5. Withdraw Cash API
  static Future<Map<String, dynamic>?> withdrawCash({
    required double amount,
    required String upiId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/wallet/withdraw'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': amount,
          'upiId': upiId,
        }),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (_) {
      // Fallback
    }
    return null;
  }

  // 6. Join Game & Deduct Entry Fee
  static Future<bool> joinGame({
    required String gameId,
    required double entryFee,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/games/join'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'gameId': gameId,
          'entryFee': entryFee,
        }),
      );
      if (response.statusCode == 200) {
        return true;
      }
    } catch (_) {}
    return false;
  }

  // 7. Get Transactions History
  static Future<List<dynamic>?> getTransactions() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/wallet/transactions'),
      ).timeout(const Duration(seconds: 3));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data'] as List<dynamic>;
      }
    } catch (_) {}
    return null;
  }

  // 8. Get Promotional Banners List (Served from server)
  static Future<List<dynamic>?> getBanners() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/banners'),
      ).timeout(const Duration(seconds: 3));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data'] as List<dynamic>;
      }
    } catch (_) {}
    return null;
  }

  // 9. Get Game Bet Audit Logs
  static Future<List<dynamic>?> getBetHistory() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/games/bet-history'),
      ).timeout(const Duration(seconds: 3));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data'] as List<dynamic>;
      }
    } catch (_) {}
    return null;
  }
}

