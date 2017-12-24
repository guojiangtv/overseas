<link rel="stylesheet" type="text/css" href="http://<?= STATIC_DOMAIN ?>/dist/mobile/css/activity/partyTime.css?v=2302611c80">

<img src="http://<?= STATIC_DOMAIN?>/dist/mobile/img/activity/partyTime/header.jpg?v=cc725cfa58" class="banner">

<section class="s_1">
	<p>Compete for "Top 10" position and win rewards!</p>
	<table border="1" cellpadding="0" cellspacing="0">
		<tr>
			<th>Top</th>
			<th>Rewards</th>
		</tr>
		<tr>
			<td>Top1</td>
			<td>One Helicopter + One Sports car</td>
		</tr>
		<tr>
			<td>Top2</td>
			<td>One Sports car + One Castle</td>
		</tr>
		<tr>
			<td>Top3</td>
			<td>One Castle + One Teddy</td>
		</tr>
		<tr>
			<td>Top4-10</td>
			<td>One bunch of roses + One Love</td>
		</tr>
	</table>
</section>

<img src="http://<?= STATIC_DOMAIN?>/dist/mobile/img/activity/partyTime/toplist.jpg?v=249da2e00b" class="line_1">

<section class="rules_btn">RULES</section>

<section class="s_2">
	<div class="content" id="listWrap">
		<ul class="type_1_wrap">
			<?php
				if(isset($list[0])):
			?>
			<li data-mid="<?= $list[0]['mid'] ?>">
				<div class="avatar_wrap">
					<img src="<?= $list[0]['headPic'] ?>" class="avatar">
					<div class="avatar_bg"></div>
					<?php
						if($list[0]['isPlaying']){
					?>
					<span class="live"></span>
					<?php
						}else{
					?>
					<span class="live hide"></span>
					<?php
						}
					?>
					<p class="points"><?= $list[0]['total'] ?></p>
				</div>
				<div class="info">
					<p>
						<span class="nickname"><?= $list[0]['nickname'] ?></span>
						<?php
							if($list[0]['isFollowing']){
						?>
						<button class="follow_btn following">Following</button>
						<?php
							}else{
						?>
						<button class="follow_btn">Follow</button>
						<?php
							}
						?>
					</p>
					<p>
						<span class="time"><?= $list[0]['minuteNumber']?></span>
						<span class="diamond"><?= $list[0]['coinNumber'] ?></span>
					</p>
				</div>
			</li>
			<?php
				endif;
			?>
		</ul>
		<ul class="type_2_wrap clearfix">
			<?php
				foreach ($list as $key => $val) {
					if($key > 0 && $key < 3){
			?>
			<li class="fl" data-mid="<?= $val['mid'] ?>">
				<div class="avatar_wrap">
					<img src="<?= $val['headPic'] ?>" class="avatar">
					<div class="avatar_bg"></div>
					<?php
						if($val['isPlaying']){
					?>
					<span class="live"></span>
					<?php
						}else{
					?>
					<span class="live hide"></span>
					<?php
						}
					?>
					<span class="rank"></span>
					<p class="points"><?= $val['total'] ?></p>
				</div>
				<div class="info">
					<p>
						<span class="nickname"><?= $val['nickname'] ?></span>
						<?php
							if($val['isFollowing']){
						?>
						<button class="follow_btn following">Following</button>
						<?php
							}else{
						?>
						<button class="follow_btn">Follow</button>
						<?php
							}
						?>
					</p>
					<p>
						<span class="time"><?= $val['minuteNumber']?></span>
						<span class="diamond"><?= $val['coinNumber'] ?></span>
					</p>
				</div>
			</li>
			<?php
				}
			}
			?>
		</ul>

		<ul class="type_3_wrap clearfix">
			<?php
				foreach ($list as $key => $val) {
					if($key > 2){
			?>
			<li  class="fl" data-mid="<?= $val['mid'] ?>">
				<div class="avatar_wrap">
					<img src="<?= $val['headPic'] ?>" class="avatar">
					<p class="points"><?= $val['total'] ?></p>
					<span class="index"><?= $key+1 ?></span>
				</div>
				<div class="info">
					<p>
						<span class="nickname"><?= $val['nickname'] ?></span>
						<span class="level_icon level_icon_<?= $val['level'] ?>"></span>
						<?php
							if($val['isFollowing']){
						?>
						<button class="follow_btn following">Following</button>
						<?php
							}else{
						?>
						<button class="follow_btn">Follow</button>
						<?php
							}
						?>
					</p>
					<p>
						<span class="time"><?= $val['minuteNumber']?></span>
						<span class="diamond"><?= $val['coinNumber'] ?></span>
					</p>
				</div>
			</li>
			<?php
					}
				}
			?>
		</ul>

	</div>
</section>





<section class="s_layer hide">
	<span class="mask"></span>
	
	<div class="rules">
		<h3>How to score?</h3>
		<p class="rule">-- 1 minute = 3 points</p>
		<span>(The longer you broadcast,the more points you receive)</span>
		<p class="rule">-- 1 diamond = 1 point</p>	
		<p class="rule">-- Scoring points and top list will update every one hour during the event</p>	
		<p class="title">Special notice:</p>
		<ul>
			<li>1.No misuse of air-time,misleading contents,hacking of diamonds</li>
			<li>2.More details can be found in End User License Agreement.Gogo.</li>
			<li>3.The platform reserves the right of final decision on the interpretation of Terms &amp; Conditions</li>
		</ul>
		<span class="close">×</span>
	</div>

</section>

<script type="text/javascript">
	seajs.use('http://<?=STATIC_DOMAIN?>/dist/mobile/js/activity/partyTime.js?v=eec735b5b8');
</script>