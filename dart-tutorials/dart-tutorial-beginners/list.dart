void main() {
  List<int> favNums = [4, 8, 15, 16, 23, 42];

  favNums[3] = 17;
  favNums.add(64);
  favNums.remove(23);

  print(favNums.indexOf(4));
  print(favNums.contains(64));

  print(favNums);
  print(favNums[1] + favNums[2]);
  print(favNums[3]);
  print(favNums.length);
}
