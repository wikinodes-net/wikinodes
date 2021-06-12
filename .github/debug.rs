fn main() {

  let one_day = std::time::Duration::from_secs(60 * 60 * 24);
  println!("one_day: {:?}", one_day);

  let now = std::time::Instant::now();
  println!("now: {:?}", now);

  let one_day_ago_by_subtraction = now - one_day;
  println!("one_day_ago_by_subtraction: {:?}", one_day_ago_by_subtraction);

  let some_one_day_ago_by_checked_sub = now.checked_sub(one_day);
  println!("some_one_day_ago_by_checked_sub: {:?}", some_one_day_ago_by_checked_sub);

  let one_day_ago_by_checked_sub = some_one_day_ago_by_checked_sub.unwrap();
  println!("one_day_ago_by_checked_sub: {:?}", one_day_ago_by_checked_sub);



  // let max_nanoseconds = 0; // u64::MAX / 1_000_000_000;
  // let duration = Duration::new(max_nanoseconds, 0);
  // println!("{:?}", now + duration);
}
