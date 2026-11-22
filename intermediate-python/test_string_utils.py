import unittest
from string_utils import reverse_string, capitalize_string, is_capitalized

class TestStringUtils(unittest.TestCase):

  def test_reverse_string(self):
    self.assertEqual(reverse_string('kyokoala'), 'alaokoyk')
    self.assertEqual(reverse_string(''), '')

  def test_capitalize_string(self):
    self.assertEqual(capitalize_string('martabak manis'), 'Martabak manis')

  def test_is_capitalized(self):
    self.assertTrue(is_capitalized('Kyokoala'))
    self.assertFalse(is_capitalized('kyokoala'))

  def test_contains(self):
    self.assertIn('koala', 'kyokoala')
    self.assertNotIn('panda', 'kyokoala')

if __name__ == '__main__':
  unittest.main()
