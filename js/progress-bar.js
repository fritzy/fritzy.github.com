/**
 * @author: Cogan Noll <colgate360@gmail.com>
 *
 * @require: jquery
 *
 * Public API:
 *  setTo(ticks)
 *  fillTo(ticks, fillSpeed, onTick, onFillComplete)
 *  isFull()
 *  stop()
 */

function ProgressBar(container, bar){
  
  /**
   * constructor
   */
  this.container = container;
  this.maxTicks = 100;
  
  this.bar = function() {};
  this.bar.bar_name = bar;
  this.bar.currentTicks = 0;
  this.bar.lock = 0;

  /**
   * set bar to specified number of ticks
   */
  this.setTo = function(ticks){
    ++this.bar.lock;
    ticks = this.checkBounds(ticks);
    $('#'+this.bar.bar_name).css('width', this.ticksToPxStr(ticks));
    this.bar.currentTicks = ticks;
  }

  /**
   * fill (animate) bar until it reaches the specified number of ticks
   */
  this.fillTo = function(ticks, fillSpeed, onTick, onFillComplete){
    ++this.bar.lock;
    onTick = typeof(a) != 'undefined' ? onTick : function(){};
    onFillComplete = typeof(a) != 'undefined' ? onFillComplete : function(){};
    this.doFillBarTo(this, ticks, 
        this.fillSpeedToDelay(fillSpeed), onTick, onFillComplete, this.bar.lock);
  }

  /**
   * function to fill a bar, calls itself recursively.
   */
  this.doFillBarTo = function(obj, ticks, delay, onTick, onFillComplete, lock) {
    if (lock == obj.bar.lock)
    {
      ticks = obj.checkBounds(ticks);
      var currentWidthPx = parseInt($('#'+obj.bar.bar_name).css('width'), 10);
      var targetWidthPx = obj.ticksToPx(ticks);
      if (currentWidthPx < targetWidthPx){
        var updatedWidthPx = currentWidthPx + 1;
      }else{
        var updatedWidthPx = currentWidthPx - 1;
      }

      if (currentWidthPx != targetWidthPx){
        $('#'+obj.bar.bar_name).css('width', updatedWidthPx+'px');
        obj.bar.currentTicks = obj.pxToTicks(updatedWidthPx);

        // call the onTick method
        onTick();

        // we can't pass in a function with arguments to setTimeout
        // so we create a closure
        var doFill = function() { obj.doFillBarTo(obj, ticks, delay, onTick, onFillComplete, lock); };
        setTimeout(doFill, delay);
      }
      else
      {
        // we're done filling
        onFillComplete();
      }
    }
  }

  /**
   * check if the progress bar is full
   */
  this.isFull = function(){
    var containerWidthPx = parseInt($('#'+this.container).css('width'), 10);
    var barWidthPx = parseInt($('#'+this.bar.bar_name).css('width'), 10);
    if (barWidthPx < containerWidthPx){
      return false;
    }else{
      return true;
    }
  }

  /**
   * stop all animation
   */
  this.stop = function(){
    ++this.bar.lock;
  }
  
  /**
   * helper functions to convert from ticks to pixels and vice versa
   */
  this.ticksToPx = function(ticks){
    var pxPerTx = parseFloat($('#'+this.container).css('width')) / this.maxTicks;
    px = ticks * pxPerTx;
    return px;
  }

  this.ticksToPxStr = function(ticks){
    var pxStr = this.ticksToPx(ticks)+'px';
    return pxStr;
  }
  
  this.pxToTicks = function(px){
    var ticksPerPx = this.maxTicks / parseFloat($('#'+this.container).css('width'));
    ticks = px * ticksPerPx;
    return ticks;
  }
  
  this.fillSpeedToDelay = function(ticksPerSecond){
    var pxPerTick = parseFloat($('#'+this.container).css('width')) / this.maxTicks;
    pxPerSecond = parseInt( (1000 / (pxPerTick * ticksPerSecond)), 10);
    return pxPerSecond;
  }

  /**
   * helper function to check that we don't set our bar size out of bounds
   */
  this.checkBounds = function(ticks){
    if (ticks <= 0){
      ticks = 0;
    }else if (ticks >= this.maxTicks){
      ticks = this.maxTicks;
    }
    return ticks;
  }
}
