fn main() {

  let one_day = std::time::Duration::from_secs(60 * 60 * 24);
  println!("one_day: {:?}", one_day);

  let now = std::time::Instant::now();
  println!("now: {:?}", now);

  let some_one_day_ago = now.checked_sub(one_day);
  println!("some_one_day_ago: {:?}", some_one_day_ago);

  let one_day_ago = some_one_day_ago.unwrap();
  println!("one_day_ago: {:?}", one_day_ago);

}
